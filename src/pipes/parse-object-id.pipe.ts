import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: string): ObjectId {
    try {
      const transformedObjectId: ObjectId = ObjectId.createFromHexString(value);
      return transformedObjectId;
    } catch (error) {
      throw new BadRequestException('Request failed (expected ObjectId)');
    }
  }
}
