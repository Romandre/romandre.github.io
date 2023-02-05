function getRandomNumber(min, max) {
    const number = Math.floor(Math.random() * (max - min)) + min;
    return number;
}

const app = Vue.createApp({
    data() {
        return {
            characters: {
                player: {
                    health: 100,
                    minHitDamage: 8,
                    maxHitDamage: 14,
                    minSpecialDamage: 10,
                    maxSpecialDamage: 16,
                    damageProbability: 5,
                    specialProbability: 4,
                    quotes: [
                        "Monster couldn't reach you!",
                        "Monster claws swinged under your head!",
                        "Sharp teeth mouth shut right in front of you!"
                    ],
                },
                monster: {
                    health: 200,
                    minHitDamage: 5,
                    maxHitDamage: 12,
                    minSpecialDamage: 10,
                    maxSpecialDamage: 18,
                    damageProbability: 4,
                    specialProbability: 7,
                    quotes: [
                        "You missed the hit",
                        "You didn't reach the monster with your weapon",
                        "Your sword bounced off the monster's thick skin"
                    ],
                }
            },
            attackBtnBar: 0,
            healthBtnBar: 0,
            currentRound: 0,
            healAvailable: false,
            specialAttackAvailable: false,
            winner: null
        };
    },
    computed: {
        getPlayerHealth() {
            return this.characters.player.health;
        },
        getMonsterHealth() {
            return this.characters.monster.health;
        },
        playerBarStyles() {
            return { width: this.characters.player.health + '%'} ;
        },
        monsterBarStyles() {
            return { width: this.characters.monster.health / 2 + '%' };
        },
        healthButtonBar() {
            return { width: Math.trunc(this.attackBar * 25) + '%' };
        },
        attactButtonBar() {
            return { width: Math.trunc(this.attackBar * 33.3) + '%' };
        },
        canUseHeal() { 
            return this.characters.player.health < 100 && this.healAvailable;
        }
    },
    watch: {
        getPlayerHealth(value) {
            if (value < 1 && this.getMonsterHealth < 1) {
                this.winner = "It's a draw!";
            } else if (value < 1) {
                this.winner = "Monster won the buttle!";
            }
        },
        getMonsterHealth(value) {
            if (value < 1 && this.getPlayerHealth < 1) {
                this.winner = "It's a draw!";
            } else if (value < 1) {
                this.winner = "You won the buttle!";
            }
        },
    },
    methods: {
        attack(e) {
            const type = e.target.getAttribute('type');

            this.dealDamage(type);

            !this.specialAttackAvailable ? this.attackBtnBar++ : '';
            !this.healAvailable ? this.healthBtnBar++ : '';

            this.specialAttackAvailable = this.attackBtnBar === 3;
            this.healAvailable = this.healthBtnBar === 4;            
            
            if (type == 'special') {
                this.attackBtnBar = 0;
                this.specialAttackAvailable = false;
            }
        },
        dealDamage(type) {
            const targets = this.characters;
            const isNormal = type === 'normal';
            
            /* Deal random damage to each character per attack attempt */
            Object.keys(targets).forEach(key => {
                const target = targets[key];
                const prob = isNormal ? target.damageProbability : target.specialProbability;

                if (getRandomNumber(0, 10) <= prob) {
                    const attackPoints = isNormal ? getRandomNumber(target.minHitDamage, target.maxHitDamage)
                                                  : getRandomNumber(target.minSpecialDamage, target.maxSpecialDamage);

                    this.characters[key].health = Math.max(0, target.health - attackPoints);
                    console.log(key + ' received a damage of ' + attackPoints + ' points');
                } else {
                    const message = target.quotes[Math.floor(Math.random() * target.quotes.length)];
                    console.log(message);
                }
            })
        },
        healPlayer() {
            const healValue = getRandomNumber(8, 20);

            this.healthBtnBar = 0;
            this.healAvailable = false;
            this.characters.player.health = Math.min(100, this.getPlayerHealth + healValue);
        }        
    }
});

app.mount('#game')