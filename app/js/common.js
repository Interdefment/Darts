var darts = new Vue({
	el: '#app',
	data: {
		sectors: [20, 1 ,18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5],
		players: [
			{ id: 1, name: 'Саша Р', points: 0, totalPoints: 0, avatar: 94, picked: false, stats: {} },
			{ id: 2, name: 'Дима', points: 0, totalPoints: 0, avatar: 19, picked: false, stats: {} },
			{ id: 3, name: 'Женя', points: 0, totalPoints: 0, avatar: 32, picked: false, stats: {} },
			{ id: 4, name: 'Саша Т', points: 0, totalPoints: 0, avatar: 8, picked: false, stats: {} },
			{ id: 5, name: 'Андрей', points: 0, totalPoints: 0, avatar: 4, picked: false, stats: {} },
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
		first: 0,
		second: 0,
		third: 0,
		set: {
			shoots: 0,
			points: 0,
			zero: 0,
			miss: 0,
			single: 0,
			double: 0,
			triple: 0,
			outer: 0,
			inner: 0,
			accuracy: 0,
			range: 0,
		},
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
		correct: function correct () {
			this.first = 0;
			this.second = 0;
			this.third = 0;
			this.pickedPlayers[this.currentPlayer].points -= this.currentPoints;
			this.currentPoints = 0;
			this.turnEnded = false;

		},
		winFunction: function win () {
			this.gameover = true;
		},
		reload: function reload () {
			window.location.reload();
		},
		shoot: function shoot (scores, hit, multiplicator) {
			this.analyze(scores, multiplicator)
			switch (this.clickCounter) {
				case 0:
					this.first = scores * multiplicator;
					break;
				case 1:
					this.second = scores * multiplicator;
					break;
				case 2:
					this.third = scores * multiplicator;
					break;
			}
			let points = hit ? scores * multiplicator : 0;
			this.currentPoints += points;
			this.pickedPlayers[this.currentPlayer].points += points;
			if (++this.clickCounter == 3) {
				this.turnEnded = true;
				this.clickCounter = 0;
			}
		},
		nextTurn: function nextTurn () {
			this.first = 0;
			this.second = 0;
			this.third = 0;
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
		analyze: function analyze (mult) {
			let id = this.pickedPlayers[this.currentPlayer].id - 1;

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
	// $($('.player-pick')[0]).click();
	// $($('.player-pick')[1]).click();
	// $('.start-play').click();
});