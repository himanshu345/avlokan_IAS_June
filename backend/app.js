const path = require('path');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/uploads/profile-pictures', express.static(path.join(__dirname, 'uploads/profile-pictures')));
app.use('/uploads/evaluated-pdfs', express.static(path.join(__dirname, 'uploads/evaluated-pdfs')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 