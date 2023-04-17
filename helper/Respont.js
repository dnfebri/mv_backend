export const responseJson = (status, message, data = "NULL") => {
  let resp = {
      success: status,
      message: message,
      data: data
  }
  return resp;
}