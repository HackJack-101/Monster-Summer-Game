function activateItem(id)
{
	if(document.getElementById('abilityitem_' + id) !== null)
		g_Minigame.CurrentScene().TryAbility(document.getElementById('abilityitem_' + id).childElements()[0]);
}

function activateAbility(id)
{
	if(document.getElementById('ability_' + id) !== null)
		g_Minigame.CurrentScene().TryAbility(document.getElementById('ability_' + id).childElements()[0]);
}

function getBoss(enemies)
{
	for(var i = 0; i < enemies.length; i++)
	{
		if(enemies[i] instanceof window.CEnemyBoss) {
			activateItem(17);
			return enemies[i];
		}
		else if(enemies[i] instanceof window.CEnemyTreasure) {
			return enemies[i];
		}
	}
	activateAbility(6);
	activateAbility(8);
	activateAbility(10);
	activateAbility(11);
	activateAbility(12);
	activateItem(14);
	activateItem(15);
	activateItem(16);
	activateItem(21);
	activateItem(22);
	activateItem(23);
	activateItem(24);
	activateAbility(9);
	return enemies[0];
}

function disableEffects() {
	if (g_Minigame !== undefined) {
		g_Minigame.CurrentScene().DoClickEffect = function() {};
		g_Minigame.CurrentScene().DoCritEffect = function( nDamage, x, y, additionalText ) {console.log("Crit! : "+nDamage)};
		g_Minigame.CurrentScene().SpawnEmitter = function(emitter) {
			emitter.emit = false;
			return emitter;
		}
	}

	// disable enemy flinching animation when they get hit
	if (CEnemy !== undefined) {
		CEnemy.prototype.TakeDamage = function() {};
		CEnemySpawner.prototype.TakeDamage = function() {};
		CEnemyBoss.prototype.TakeDamage = function() {};
	}
}

function getEnemy()
{
	var enemies = g_Minigame.m_CurrentScene.m_rgEnemies;
	var enemy = getBoss(enemies);
	if (enemy !== undefined)
	{
		if (enemy.m_nLane != g_Minigame.CurrentScene().m_nExpectedLane) {
			g_Minigame.m_CurrentScene.TryChangeLane(enemy.m_nLane);
		}
		if (enemy.m_nID != g_Minigame.CurrentScene().m_nTarget) {
			g_Minigame.CurrentScene().TryChangeTarget(enemy.m_nID);
		}
	}
}

function respawn()
{
	if ((g_Minigame.CurrentScene().m_bIsDead) && 
			((g_Minigame.CurrentScene().m_rgPlayerData.time_died) + 5) < (g_Minigame.CurrentScene().m_nTime)) {
		RespawnPlayer();
	}
}

function heal()
{
	if(g_Minigame.m_CurrentScene.m_rgPlayerData.hp / g_Minigame.m_CurrentScene.m_rgPlayerTechTree.max_hp < 0.35)
		activateAbility(7);
}

disableEffects();

var cheat = setInterval(function() {
	heal();
	respawn();
	getEnemy();
    g_Minigame.m_CurrentScene.DoClick(
        {
            data: {
                getLocalPosition: function() {					
					var enemy = g_Minigame.m_CurrentScene.GetEnemy(
						g_Minigame.m_CurrentScene.m_rgPlayerData.current_lane,
						g_Minigame.m_CurrentScene.m_rgPlayerData.target);
					var laneOffset = enemy.m_nLane * 440;

					return {
						x: enemy.m_Sprite.position.x - laneOffset,
						y: enemy.m_Sprite.position.y - 52
					}
                }
            }
        }
    );
}, 50);

var items = setInterval(function()
{
	activateItem(18);
	activateItem(19);
},1000*10);