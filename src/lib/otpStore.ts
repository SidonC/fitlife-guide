type OTP = {
  code: string;
  expires: number;
};

const store = new Map<string, OTP>();

export default store;
