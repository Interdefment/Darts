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
			{ id: 1, name: 'Саша', points: 0, totalPoints: 0, avatar: 2, picked: false },
			{ id: 2, name: 'Дима', points: 0, totalPoints: 0, avatar: 19, picked: false },
			{ id: 3, name: 'Женя', points: 0, totalPoints: 0, avatar: 15, picked: false },
			{ id: 4, name: 'Паша', points: 0, totalPoints: 0, avatar: 28, picked: false }
		],
		currentPlayer: 0,
		clickCounter: 0,
		overlayClosed: false,
		newName: '',
		avatarChoosing: false,
		avatarPicked: 0,
	},
	computed: {
		pickedPlayers: function () {
			return this.players.filter(function (player) {
				return player.picked
			})
		},
		freePlayers: function () {
			return this.players.filter(function (player) {
				return !player.picked
			})
		},
	},
	methods: {
		updateScroll: function updateScroll () {
				setTimeout(function() {
					$(".nano").nanoScroller();
				}, 500);
		},
		shoot: function shoot (points) {
			this.players[this.currentPlayer].points += points;
			if (++this.clickCounter == 3) {
				this.clickCounter = 0;
				this.currentPlayer = 
					this.currentPlayer == this.pickedPlayers.length - 1 ? 0
					: this.currentPlayer + 1;
			}
		},
		close: function close () {
			this.overlayClosed = true;
		},
		closeAvatarLib: function closeAvatarLib () {
			this.avatarChoosing = false;
		},
		openModal: function openModal () {
			this.overlayClosed = false;
		},
		addPlayer: function addPlayer (e) {
			if (!avatarPicked || this.newName == '')
				return false;
			const newPlayer = { 
				id: this.players.length + 1,
				name: this.newName,
				points: 0,
				totalPoints: 0,
				avatar: avatarPicked,
				picked: true
			}
			this.players.push(newPlayer);
			this.updateScroll();
			this.newName = '';
			$('.new-avatar').attr('src','img/avatars/noname.png');
		},
		checkAvatar: function checkAvatar (number) {
			for (let i = 0; i < this.players.length; i++) {
				if (this.players[i].avatar == number) {
				 return true;
				}
			}
			return false;
		},
		openAvatarLib: function chooseAva () {
			this.avatarChoosing = true;
			this.updateScroll();
		},
		pickAvatar: function pickAvatar (number) {
			avatarPicked = number;
			$('.new-avatar').attr('src','img/avatars/' +  number + '.png');
			this.closeAvatarLib();
		},
		startPlay: function startPlay () {
			if (this.pickedPlayers.length < 2)
				return false;
			this.close();
		},
	},
	mounted: function () {
		for (let i = 1; i < 96; i++) {
			if (this.checkAvatar(i)) {
				continue;
			}
			let img = '<img src="img/avatars/' + i + '.png" alt="' + i + '" class="avatar" data-number="' + i + '">'
			$('.avatar-lib .nano-content').append(img);			
		};
	}
})
$('.avatar-lib .avatar').on('click', function(e) {
	darts.pickAvatar($(this).attr('data-number'))
});
$(document).ready(function() {
	$(".nano").nanoScroller({falsh:true });
});