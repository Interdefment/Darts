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
			{ id: 1, name: 'Саша', points: 0, totalPoints: 0, avatar: 2, picked: false, },
			{ id: 2, name: 'Дима', points: 0, totalPoints: 0, avatar: 19, picked: false, },
			{ id: 3, name: 'Женя', points: 0, totalPoints: 0, avatar: 15, picked: false, },
			{ id: 4, name: 'Паша', points: 0, totalPoints: 0, avatar: 28, picked: false, }
		],
		pickedPlayers: [],
		currentPlayer: 0,
		clickCounter: 0,
		overlayClosed: false,
		newName: '',
		avatarChoosing: false,
		avatarPicked: 0,
		notification: '',
		currentSector: 1,
		turnEnded: false,
		currentPoints: 0,
		gameover: false,
	},
	computed: {
		// pickedPlayers: function () {
		// 	return this.players.filter(function (player) {
		// 		return player.picked
		// 	})
		// },
		freePlayers: function () {
			return this.players.filter(function (player) {
				return !player.picked
			})
		},
		playersRating () {
			var clone = this.pickedPlayers.slice(0);
			return clone.sort(function(d1, d2){
				return d1.points < d2.points
			});
	 }
	},
	methods: {
		showMessage: function message (text) {
			this.notification = text;
			setTimeout(() => {
				this.notification = '';

			}, 3000);
		},
		updateScroll: function updateScroll () {
				setTimeout(function() {
					$(".nano").nanoScroller();
				}, 500);
		},
		shoot: function shoot (scores, hit) {
			let points = hit ? scores : 0;
			this.currentPoints += points;
			this.pickedPlayers[this.currentPlayer].points += points;
			if (++this.clickCounter == 3) {
				this.turnEnded = true;
				this.clickCounter = 0;
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
			if (!this.avatarPicked || this.newName == '') {
				this.showMessage('Введите имя и выберите аватар')
				return false;
			}
			const newPlayer = { 
				id: this.players.length + 1,
				name: this.newName,
				points: 0,
				totalPoints: 0,
				avatar: this.avatarPicked,
				picked: true
			}
			this.players.push(newPlayer);
			this.pickedPlayers.push(newPlayer);
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
			this.avatarPicked = number;
			$('.new-avatar').attr('src','img/avatars/' +  number + '.png');
			this.closeAvatarLib();
		},
		startPlay: function startPlay () {
			if (this.pickedPlayers.length < 2) {
				this.showMessage('Выбрано менее двух игроков')
				return false;
			} else 
			if (this.pickedPlayers.length > 6) {
				this.showMessage('Выбрано слишком много игроков')
				return false;
			};
			this.close();
		},
		nextTurn: function nextTurn () {
			this.turnEnded = false;
			this.currentPoints = 0;
			if (this.currentPlayer == this.pickedPlayers.length - 1) {
				this.currentPlayer = 0;
				switch (this.currentSector) {
					case 20: 
						this.currentSector = 50;
						break;
					case 50:
						this.winFunction();
						break;
					default:
						this.currentSector++;
				}
			} else {
				this.currentPlayer = this.currentPlayer + 1;
			}
		},
		correct: function correct () {
			this.pickedPlayers[this.currentPlayer].points -= this.currentPoints;
			this.currentPoints = 0;
			this.turnEnded = false;

		},
		winFunction: function win () {
			this.gameover = true;
		},
		reload: function reload () {
			window.location.reload();
		}
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
	// $('.player-pick').click();
	// $('.start-play').click();
});