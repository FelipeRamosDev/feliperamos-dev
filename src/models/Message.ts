type MessageSetup = {
   timestamp?: number;
   content: string;
   from?: 'user' | 'assistant';
   threadID?: string | null;
   agentId?: string;
   messageId?: string;
}

export default class Message {
   public content: string;
   public from: 'user' | 'assistant';
   public timestamp?: number;
   public self?: boolean;
   public agentId?: string;
   public threadID?: string | null;
   public dateString: string;
   public timeString: string;
   public messageId?: string;

   constructor(setup: MessageSetup) {
      const { timestamp, content, from = 'user', threadID, agentId = '', messageId } = setup;

      this.threadID = threadID;
      this.messageId = messageId;
      this.agentId = agentId;
      this.self = Boolean(from === 'user');
      this.timestamp = timestamp || Date.now();
      this.content = content;
      this.from = from;
      this.dateString = this.getDateString();
      this.timeString = this.getTimeString();
   }

   get date(): Date {
      return new Date(this.timestamp || Date.now());
   }

   getDateString(): string {
      const options: Intl.DateTimeFormatOptions = {
         year: 'numeric',
         month: '2-digit',
         day: '2-digit',
      };

      return this.date.toLocaleDateString(undefined, options);
   }

   getTimeString(): string {
      const options: Intl.DateTimeFormatOptions = {
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
      };

      return this.date.toLocaleTimeString(undefined, options);
   }

   serialize() {
      return { ...this };
   }

   serializeIn() {
      return {
         message: this.content,
         roomId: this.threadID,
         agentId: this.agentId
      };
   }
}
