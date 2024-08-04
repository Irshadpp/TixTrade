import { ExpirationCompleteEvent, Publisher, Subjects } from "@ir-tixtrade/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    
}