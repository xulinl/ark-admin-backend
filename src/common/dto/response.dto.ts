import { v4 as uuidv4 } from 'uuid';
import { formatDateTime } from '@/utils/date.util';
export class ResponseDto<T> {
  code: number | string;
  message: string;
  data: T;
  uuid: string;
  timestamp: string;
  constructor(code: number | string, message: string, data: T) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.uuid = uuidv4();
    this.timestamp = formatDateTime(new Date());
  }
}
