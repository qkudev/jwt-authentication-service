class SuccessResponse<T = any> {
  public readonly success: true = true;

  constructor(public readonly data: T = null) {}
}

export default SuccessResponse;
