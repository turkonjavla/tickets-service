import { Publisher, Subjects, TicketUpdatedEvent } from '@vttickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
