import { Publisher, Subjects, TicketCreatedEvent } from '@vttickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
