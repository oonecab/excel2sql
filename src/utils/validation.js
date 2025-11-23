// 验证邮箱格式
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 验证密码强度
  export const validatePassword = (password) => {
    // 至少6个字符
    return password && password.length >= 6;
  };

  // 验证用户名
  export const validateUsername = (username) => {
    // 3-20个字符，字母数字下划线
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };