var darts = new Vue({
	el: '#app',
	data: {
		sectors: [20, 1 ,18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5],
		players: [],
		pickedPlayers: [],
		currentPlayer: 0,
		clickCounter: 0,
		overlayClosed: false,
		newName: '',
		avatarChoosing: false,
		avatarPicked: 0,
		notification: '',
		messageDisabled: false,
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
			misshot: 0,
			oneshot: 0,
			twoshot: 0,
			threeshot: 0,
			another: 0,
			single: 0,
			double: 0,
			triple: 0,
			outer: 0,
			inner: 0,
			sibling: 0,
			middleMiss: 0,
			small: 0,
			big: 0,
		},
	},
	computed: {
		freePlayers: function () {
			return this.players.filter(function (player) {
				return !player.picked
			})
		},
		playersRating: function () {
			var clone = this.pickedPlayers.slice(0);
			return clone.sort(function(d1, d2){
				return d1.points < d2.points
			});
		}
	},
	methods: {
		/**
		 * Возвращает массив, первый элемент которого - номер сектора перед указанным, второй элемент - номер сектора после указанного
		 * @param {number} sector
		 */
		getSiblings: function getSiblng (sector) {
			if (sector == 20)
				return [5, 1];
			if (sector == 5)
				return [12, 20];
			for (let i = 1; i < 19; i ++) {
				if (this.sectors[i] == sector)
					return [this.sectors[i - 1], this.sectors[i + 1]];
			};
		},
		/**
		 * Выводит сообщение в виде выпадающей сверху таблички на 2,5 сек
		 * @param {string} text
		 */
		showMessage: function message (text) {
			if (this.messageDisabled)
				return false;
			this.messageDisabled = true;
			this.notification = text;
			setTimeout(() => {
				this.notification = '';
				this.messageDisabled = false;
			}, 2500);
		},
		/**
		 * Добавляет/убирает полосу прокрутки в соответствующих блоках, если появилась такая необходимость
		 */
		updateScroll: function updateScroll () {
				setTimeout(function() {
					$(".nano").nanoScroller();
				}, 500);
		},
		/**
		 * Добавить игрока в список выбранных и поставить в очередность хода
		 * @param {object} player
		 */
		pickPlayer: function pickPlayer (player) {
			if (player.picked)
				return false;
			player.picked = true;
			this.pickedPlayers.push(player);
			this.updateScroll();
		},
		/**
		 * Убрать игрока из списка выбранных
		 * @param {object} player
		 * @param {number} index
		 */
		removePlayer: function removePlayer (player, index) {
			if (!player.picked)
				return false;
			this.players[player.id - 1].picked = false;
			this.pickedPlayers.splice(index, 1);
			this.updateScroll();
		},
		/**
		 * Закрыть окно выбора игроков
		 */
		close: function close () {
			this.overlayClosed = true;
		},
		/**
		 * Закрыть окно выбора автарки
		 */
		closeAvatarLib: function closeAvatarLib () {
			this.avatarChoosing = false;
		},
		/**
		 * Добавить нового игрока, если не выбрана автарка или не введено имя, то выведется предупреждение
		 */
		addPlayer: function addPlayer () {
			if (!this.avatarPicked || this.newName == '') {
				this.showMessage('Введите имя и выберите аватар')
				return false;
			}
			var regexp = /^[a-z\s]+$/i;
			if(regexp.test(this.newName)) {
				this.showMessage('Введите имя на русском языке')
				return false;
			}
			const newPlayer = {
				id: this.players.length + 1,
				name: this.newName,
				points: 0,
				totalPoints: 0,
				avatar: this.avatarPicked,
				picked: true, statsShown: false,
				stats: {
					shoots: 0, points: 0, zero: 0, misshot: 0, oneshot: 0, twoshot: 0, threeshot: 0, another: 0, single: 0, double: 0, triple: 0, outer: 0, inner: 0, accuracy: 0, sibling: 0, small: 0, big: 0, middleMiss: 0,
				},
				globalShown: false,
				globalStats: {
					shoots: 0, points: 0, zero: 0, misshot: 0, oneshot: 0, twoshot: 0, threeshot: 0, another: 0, single: 0, double: 0, triple: 0, outer: 0, inner: 0, accuracy: 0, sibling: 0, maxScores: 0, minScores: 0, games: 0, small: 0, big: 0, middleMiss:0,
				}
			}
			this.updateScroll();
			const newSend = {
				firstname: newPlayer.name,
				avatar: newPlayer.avatar,
				globalStats: {
					shoots: 0, points: 0, zero: 0, misshot: 0, oneshot: 0, twoshot: 0, threeshot: 0, another: 0, single: 0, double: 0, triple: 0, outer: 0, inner: 0, accuracy: 0, sibling: 0, maxScores: 0, minScores: 0, games: 0, small: 0, big: 0, middleMiss:0,
				}
			};
			$.ajax({
				url: 'https://darts-api.herokuapp.com/api/v1/registry_player/',
				method: 'POST',
				data: newSend,
				cached: false,
				success: data => {
					newPlayer.idDB = data.user_id;
					this.players.push(newPlayer);
					this.pickedPlayers.push(newPlayer);
					this.newName = '';
					$('.avatar-lib').find('img[data-number="' + this.avatarPicked + '"]').remove();
					$('.new-avatar').attr('src','img/avatars/noname.png');
					this.avatarPicked = 0;
				},
				error: function(err){
					console.log(err.responseText);
					darts.showMessage('Не удалось добавить игрока в базу данных')
				}
			})
		},
		/**
		 * Если аватар с заданным номером уже закрепленом за каким-нибудь игроком, вернет true, иначе false
		 */
		checkAvatar: function checkAvatar (number) {
			for (let i = 0; i < this.players.length; i++) {
				if (this.players[i].avatar == number) {
					return true;
				}
			}
			return false;
		},
		/**
		 * Открыть библиотеку автаров
		 */
		openAvatarLib: function chooseAva () {
			this.notification = '';
			this.avatarChoosing = true;
			this.updateScroll();
		},
		/**
		 * Выбрать аватар с указанным номером из библиотеки, закрыть библиотеку
		 * @param {number} number
		 */
		pickAvatar: function pickAvatar (number) {
			this.avatarPicked = number;
			$('.new-avatar').attr('src','img/avatars/' +  number + '.png');
			this.closeAvatarLib();
		},
		/**
		 * Если выбрано два или более игрока, то начать игру
		 */
		startPlay: function startPlay () {
			this.notification = '';
			if (this.pickedPlayers.length < 2) {
				this.showMessage('Выбрано менее двух игроков')
				return false;
			};
			this.close();
		},
		/**
		 * Отменить последние три броска игрока
		 */
		correct: function correct () {
			this.first = 0;
			this.second = 0;
			this.third = 0;
			this.pickedPlayers[this.currentPlayer].points -= this.currentPoints;
			this.currentPoints = 0;
			this.turnEnded = false;
		},
		/**
		 * Показать сообщение завершения игры, изменить соответсвующую статистику у игроков, отправить данные в БД
		 */
		winFunction: function win () {
			this.gameover = true;
			let sendStats = {};
			for (let i = 0; i < this.pickedPlayers.length; i ++) {
				let player = this.players[this.pickedPlayers[i].id - 1];
				player.globalStats.games++;
				if (player.stats.points > player.globalStats.maxScores)
					player.globalStats.maxScores = player.stats.points;
				if (player.stats.points < player.globalStats.minScores)
					player.globalStats.minScores = player.stats.points;
				for (stat in player.stats) {
					player.globalStats[stat] += player.stats[stat];
				}
				sendStats[player.name] = {};
				sendStats[player.name].user_id = player.idDB;
				for (stat in player.globalStats) {
					sendStats[player.name][stat] = player.globalStats[stat];
				};
			};
			$.ajax({
				url:'https://darts-api.herokuapp.com/api/v1/update_all_stats/',
				method: 'POST',
				data: JSON.stringify(sendStats),
				cached: false,
				success: function(data){
					console.log(data);
				},
				error: function(err){
					console.log(err.responseText);
					darts.showMessage('Не удалось отправить статистику за игру')
				}
			})
		},
		/**
		 * Обновить страницу
		 */
		reload: function reload () {
			window.location.reload();
		},
		/**
		 * Подсчет статистики (необходим вызов после каждого броска)
		 * @param {number} scores
		 * @param {number} mult
		 * @param {boolean} isSmall
		 */
		analyze: function analyze (scores, mult, isSmall) {
			this.set.shoots++;
			let id = this.pickedPlayers[this.currentPlayer].id - 1;
			let siblings = this.getSiblings(this.currentSector);
			if (mult == 0) {
				this.set.zero++;
			} else if (scores == this.currentSector || (scores * 2 == 50 && this.currentSector == 50)) {
				this.set.points += mult * scores;
				switch (mult) {
					case 1:
						if (scores == 25) {
							this.set.outer++;
							break;
						}
						this.set.single++;
						if (isSmall)
							this.set.small++;
						else
							this.set.big++;
						break;
					case 2:
						if (scores == 25)
							this.set.inner++;
						else
							this.set.double++;
						break;
					case 3:
						this.set.triple++;
						break;
				};
			} else {
				this.set.another++;
				switch(this.currentSector) {
					case 50:
						if (isSmall)
							this.set.sibling++;
							break;
					default:
						if (scores == 25) {
							this.set.middleMiss++;
						};
						if (scores == siblings[0] || scores == siblings[1])
							this.set.sibling++;
				};
			};
			if (this.clickCounter == 2) {
				switch (this.set.zero + this.set.another) {
					case 0:
						this.set.threeshot++;
						break;
					case 1:
						this.set.twoshot++;
						break;
					case 2:
						this.set.oneshot++;
						break;
					case 3:
						this.set.misshot++;
						break;
				};
				for (s in this.set) {
					this.players[id].stats[s] += this.set[s];
					this.set[s] = 0;
				};
			};
		},
		/**
		 * Обработка результатов броска
		 * @param {number} scores
		 * @param {boolean} hit
		 * @param {number} multiplicator
		 * @param {boolean} isSmall
		 */
		shoot: function shoot (scores, hit, multiplicator, isSmall = false) {
			this.analyze(scores, multiplicator, isSmall);
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
		/**
		 * Переход к следующему игроку
		 */
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
	},
	mounted: function () {
		setTimeout(() => {
			for (let i = 1; i < 96; i++) {
				if (this.checkAvatar(i)) {
					continue;
				}
				let img = '<img src="img/avatars/' + i + '.png" alt="' + i + '" class="avatar" data-number="' + i + '">'
				$('.avatar-lib .nano-content').append(img);
			};
			$('.avatar-lib .avatar').on('click', function() {
				darts.pickAvatar($(this).attr('data-number'))
			});
		}, 700);
	},
	beforeCreate() {
		$.ajax({
			url: 'https://darts-api.herokuapp.com/api/v1/users_list/?format=json',
			method: 'GET',
			data: null,
			cached: false,
			success: function(data){
				for (let i = 0; i < data.length; i++) {
					const newPlayer = {
						id: darts.players.length + 1,
						idDB: data[i].user_id.id,
						name: data[i].user_id.first_name,
						points: 0,
						totalPoints: 0,
						avatar: data[i].avatar,
						picked: false,
						statsShown: false,
						stats: {
							shoots: 0, points: 0, zero: 0, misshot: 0, oneshot: 0, twoshot: 0, threeshot: 0, another: 0, single: 0, double: 0, triple: 0, outer: 0, inner: 0, accuracy: 0, sibling: 0, small: 0, big: 0, middleMiss: 0,
						},
						globalShown: false,
						globalStats: {
							shoots: 0, points: 0, zero: 0, misshot: 0, oneshot: 0, twoshot: 0, threeshot: 0, another: 0, single: 0, double: 0, triple: 0, outer: 0, inner: 0, accuracy: 0, sibling: 0, maxScores: 0, minScores: 9999, games: 0, small: 0, big: 0, middleMiss:0,
						}
					}
					for (stat in newPlayer.globalStats) {
						newPlayer.globalStats[stat] = data[i][stat];
					}
					darts.players.push(newPlayer);
				}
			},
			error: function(err){
				console.log(err.responseText);
				darts.showMessage('Не удалось получить список игроков')
			}
		})
	},
})

$(document).ready(function() {
	$(".nano").nanoScroller({falsh:true });
	// $($('.player-pick')[0]).click();
	// $($('.player-pick')[1]).click();
	// $('.start-play').click();
});