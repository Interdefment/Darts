var darts = new Vue({
	el: '#app',
	data: {
		sectors: [
			{	value: 20,},
			{	value: 1,},
			{	value: 18,},
			{	value: 4,},
			{	value: 13,},
			{	value: 6,},
			{	value: 10,},
			{	value: 15,},
			{	value: 2,},
			{	value: 17,},
			{	value: 3,},
			{	value: 19,},
			{	value: 7,},
			{	value: 16,},
			{	value: 8,},
			{	value: 11,},
			{	value: 14,},
			{	value: 9,},
			{	value: 12,},
			{	value: 5,},
		],
		players: [
			{ id: 1, name: 'Саша', points: 0, totalPoints: 0 },
			{ id: 2, name: 'Дима', points: 0, totalPoints: 0 },
			{ id: 3, name: 'Женя', points: 0, totalPoints: 0 },
		],
		currentPlayer: 0,
		clickCounter: 0,
	},
	methods: {
		shoot: function SH (points) {
			console.log(points)
			this.players[this.currentPlayer].points += points;
			if (++this.clickCounter == 3) {
				this.clickCounter = 0;
				this.currentPlayer = this.currentPlayer == 2 ? 0 : this.currentPlayer + 1;

			}
		}
	}
})