export class ApiResponseDto<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  path?: string;

  constructor(data: T, message: string = 'Success', success: boolean = true) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message?: string): ApiResponseDto<T> {
    return new ApiResponseDto(data, message, true);
  }

  static error<T>(message: string, data?: T): ApiResponseDto<T> {
    return new ApiResponseDto(data, message, false);
  }
} 