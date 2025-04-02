export class Message {
  constructor({
    messageId = null,
    senderId,
    receiverId,
    receiverName = null,
    propertyId,
    content,
    timeSent,
  }) {
    this.messageId = messageId; // Optional message ID
    this.senderId = senderId; // Required sender ID
    this.receiverId = receiverId; // Required receiver ID
    this.receiverName = receiverName; // Optional receiver name
    this.propertyId = propertyId; // Required property ID
    this.content = content; // Required message content
    this.timeSent = new Date(timeSent); // Required time sent as Date object
  }

  // Static method to create a Message instance from a JSON object
  static fromJson(json) {
    return new Message({
      messageId: json.id != null ? parseInt(json.id, 10) : null,
      senderId: json.senderId,
      receiverId: json.receiverId,
      receiverName: json.receiver_fullname,
      propertyId: json.propertyId,
      content: json.content,
      timeSent: json.timeSent, // Assuming timeSent is already a valid ISO string
    });
  }

  // Method to convert the Message instance to a JSON object
  toJson() {
    return {
      id: this.messageId,
      senderId: this.senderId,
      receiverId: this.receiverId,
      receiver_fullname: this.receiverName,
      propertyId: this.propertyId,
      content: this.content,
      timeSent: this.timeSent.toISOString(), // Convert Date to ISO string
    };
  }
}
