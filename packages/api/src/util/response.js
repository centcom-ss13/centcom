import { Boom } from '@hapi/boom';
import HttpStatus from 'http-status-codes'
export function getErrorResponse({
  code = 500,
  messageKey,
}) {
}