from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware  # Import CORS Middleware
from pydantic import BaseModel
import os
import asyncio
from gpt_researcher import GPTResearcher
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

app = FastAPI()

# ✅ Allow frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can specify your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class ReportRequest(BaseModel):
    company_website: str
    company_domain: str

async def generate_report(company_website, company_domain):
    """
    Generates a competitor analysis report using GPTResearcher.
    """
    query = f"Analyze competitors of {company_website} in {company_domain} industry using GPTResearcher"
    researcher = GPTResearcher(query=query, report_type="competitive_analysis")
    research_result = await researcher.conduct_research() 
    report = await researcher.write_report()
    return report

def save_report_as_pdf(title, content):
    """
    Saves the generated report as a well-formatted PDF.
    """
    sanitized_title = title.replace(" ", "_").replace("https://", "").replace("/", "_") + ".pdf"
    pdf_path = os.path.join(os.getcwd(), sanitized_title)

    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, title)

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 70, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    c.setFont("Helvetica", 11)
    text = c.beginText(50, height - 100)
    text.setFont("Helvetica", 11)

    for line in content.split("\n"):
        text.textLine(line)

    c.drawText(text)
    c.save()

    return pdf_path

@app.post("/generate_report/")
async def generate_report_endpoint(request: ReportRequest):
    """
    API endpoint to generate a competitor analysis report.
    """
    try:
        report_content = await generate_report(request.company_website, request.company_domain)
        pdf_path = save_report_as_pdf(f"Competitor Analysis for {request.company_website}", report_content)
        
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="Failed to generate report.")

        return FileResponse(pdf_path, media_type="application/pdf", filename=f"Competitor_Analysis_{request.company_website}.pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
