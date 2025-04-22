1) Open terminal
ssh root@157.245.104.62
password: dhruv123
2) Cd deep-research
3) source venv/bin/activate
4) export $(grep -v '^#' .env.local | xargs)
5) main:app --host 0.0.0.0 --port 8000 --reload --log-level debug
now go to http://157.245.104.62:8000/docs
6) open a new terminal
ssh root@157.245.104.62
password: dhruv123
1) Cd deep-research
2) source venv/bin/activate
3) export $(grep -v '^#' .env.local | xargs)
4) cd frontend/
5) npm run dev
