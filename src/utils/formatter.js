const fileSizeFormatter = function(fileSize) {
  let fileSizeStr = fileSize + " B";
  if (fileSize >= 1024) fileSizeStr = (fileSize / 1024).toFixed(2) + " KB";
  if (fileSize >= 1024 * 1024)
    fileSizeStr = (fileSize / 1024 / 1024).toFixed(2) + " MB";
  if (fileSize >= 1024 * 1024 * 1024)
    fileSizeStr = (fileSize / 1024 / 1024 / 1024).toFixed(2) + " GB";
  if (fileSize >= 1024 * 1024 * 1024 * 1024)
    fileSizeStr = (fileSize / 1024 / 1024 / 1024 / 1024).toFixed(2) + " TB";
  if (fileSize >= 1024 * 1024 * 1024 * 1024 * 1024)
    fileSizeStr =
      (fileSize / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(2) + " PB";
  return fileSizeStr;
};

const dateTimeFormatter = function(dateTime) {
  if (dateTime != null) {
    const dateMat = new Date(dateTime);
    const year = dateMat.getFullYear();
    const month = dateMat.getMonth() + 1;
    const day = dateMat.getDate();
    const hh = dateMat.getHours();
    const mm = dateMat.getMinutes();
    const ss = dateMat.getSeconds();
    return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
  }
};

export { fileSizeFormatter, dateTimeFormatter };
