# MongoDB Atlas – seed / connection fix

Agar IP whitelist sahi hai phir bhi **"Could not connect"** aa raha hai, to ye steps try karo:

## 1. Connection string Atlas se copy karo

1. **https://cloud.mongodb.com** → apna **Teamex** project open karo.
2. Left side: **Database** → apne cluster (e.g. **Cluster0**) ke saamne **Connect**.
3. **Drivers** (ya "Connect your application") choose karo.
4. **Node.js** select karo, version 5.5 or 6.0.
5. Wahan jo connection string dikhe (jaise `mongodb+srv://...`) use **Copy** karo.

## 2. .env mein sahi format use karo

- Agar **SRV** copy kiya:  
  `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/teamex?retryWrites=true&w=majority`
- `USER` aur `PASSWORD` apne database user se replace karo (password mein special chars ho to URL-encode karo).
- Database name **teamex** rakho (slash ke baad: `...net/teamex?retry...`).

Agar **SRV** se `querySrv ECONNREFUSED` aaye, to **standard** format use karo (port 27017):

```env
MONGODB_URI=mongodb://USER:PASSWORD@cluster0.xxxxx.mongodb.net:27017/teamex?retryWrites=true&w=majority&ssl=true&authSource=admin
```

## 3. Database Access check karo

- Left sidebar → **Database Access**.
- Ensure **shubhanshu_db_user** (ya jo user use kar rahe ho) exists.
- Us user ke liye **Atlas admin** ya **Read and write to any database** permission ho.
- Agar user / password change kiya ho to .env mein wahi use karo.

## 4. Seed dubara chalao

```bash
npm run seed
```

Ab seed run karo; agar phir bhi error aaye to terminal ka **pura error** (jaise "Full error: ...") copy karke bhejo.
