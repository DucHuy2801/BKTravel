const moment = require('moment');

// Hàm tạo mã mới và thiết lập thời gian hết hạn trong 2 phút
function generateCodeAndExpiration() {
  const code = generateRandomCode(); // Hàm tạo mã ngẫu nhiên (thay thế hàm này bằng cách tạo mã của bạn)
  const expirationTime = moment().add(2, 'minutes'); // Thời gian hết hạn: thời điểm hiện tại + 2 phút
    console.log(`11`, expirationTime)
  return { code, expirationTime };
}

// Hàm tạo mã ngẫu nhiên (ví dụ sử dụng cho mã gồm 6 chữ số)
function generateRandomCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Hàm kiểm tra xem mã có còn hợp lệ hay không
function isCodeValid(codeExpirationTime) {
  const now = moment(); // Thời gian hiện tại
  console.log(`now`, now)
  const expirationTime = moment(codeExpirationTime); // Thời gian hết hạn của code

  // Kiểm tra xem thời gian hiện tại có trước thời gian hết hạn hay không
  console.log(`1`, now.isBefore(expirationTime))
  return now.isBefore(expirationTime);
}

// Sử dụng hàm để tạo mã và thời gian hết hạn
const { code, expirationTime } = generateCodeAndExpiration();
console.log(`Generated code: ${code}`);
console.log(`Code expires at: ${expirationTime.format('YYYY-MM-DD HH:mm:ss')}`);
isCodeValid(expirationTime)

// // Sử dụng hàm kiểm tra sau 2 phút
// setTimeout(() => {
//   if (isCodeValid(expirationTime)) {
//     console.log('Code is still valid after 2 minutes.');
//   } else {
//     console.log('Code has expired after 2 minutes.');
//   }
// }, 2 * 60 * 1000); // 2 phút được chuyển đổi thành mili giây
