export class Todo {
	title: string;
	body: string;
	createdAt: Date;

	constructor(title: string, body: string) {
		this.title = title;
		this.body = body;
		this.createdAt = new Date();
	}
}

export const dummyTodo = new Todo(
	"hello world",
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam a condimentum justo. Sed egestas tempor dapibus. Curabitur sit amet varius tortor. Phasellus ultricies purus in hendrerit venenatis. Vivamus ultricies sagittis nibh, sit amet luctus metus dapibus nec. Vivamus nec malesuada elit, eu egestas urna. Nullam mauris felis, vulputate ut augue eu, pretium laoreet nisl. Vestibulum non arcu a ipsum mattis tempus. Nullam sollicitudin non nisi at luctus. Proin pharetra, orci id egestas venenatis, nisl orci bibendum urna, dapibus ullamcorper nibh nisl a arcu. Aenean et gravida odio. Aliquam erat volutpat. Mauris convallis euismod nibh, in gravida metus luctus sed. Integer neque mauris, rhoncus ut tristique sed, malesuada id lorem.",
);
