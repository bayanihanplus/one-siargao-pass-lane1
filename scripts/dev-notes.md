# Local Dev Notes

1. Start docker compose in docker/docker-compose.yml
2. Configure backend/.env from backend/.env.example
3. Run prisma generate
4. Run prisma migrate dev
5. Start backend and frontend
6. Test APIs in this order:
   - auth register/login
   - trips create/get
   - passes issue/get
   - activities create template/create instance
   - bookings create/link-trip
   - manifests generate/submit
   - manifest approvals approve/deny
