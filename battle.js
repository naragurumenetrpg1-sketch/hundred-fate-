// battle.js
// Pure battle-simulation logic: unit stats, targeting, movement, and combat resolution.
// No DOM access, no rendering, no game-flow/UI state. Exposed as window.Battle.
//
// This is a direct extraction from the HTML prototype (behavior-identical),
// the first step toward a shared engine used by Story Mode / Endless Trial / Stage Editor.

(function () {
  const TYPES = {
    physical: { label: '物理', hp: 15, atk: 4, range: 1, shape: 'circle', splash: false },
    ranged:   { label: '遠距離', hp: 8,  atk: 3, range: 3, shape: 'triangle', splash: false },
    magic:    { label: '魔法', hp: 7,  atk: 5, range: 2, shape: 'diamond', splash: true },
  };
  const TYPE_KEYS = Object.keys(TYPES);

  let _uid = 0;
  function nextId() { return _uid++; }

  function makeUnit(team, type, x, y, statMult = 1.0) {
    const t = TYPES[type];
    const hp = Math.round(t.hp * statMult);
    const atk = Math.round(t.atk * statMult);
    return { id: nextId(), team, type, x, y, hp, maxHp: hp, atk, range: t.range, splash: t.splash };
  }

  // Reuses a pre-existing unit-shaped object (e.g. persisted enemy state from a
  // previous attempt) and just assigns it a fresh id for this battle instance.
  function reviveUnit(unitLike) {
    unitLike.id = nextId();
    return unitLike;
  }

  function occupied(units, x, y) {
    return units.find(u => u.hp > 0 && u.x === x && u.y === y);
  }

  function isObstacleCell(obstacles, x, y) {
    return !!(obstacles && obstacles.some(o => o.x === x && o.y === y));
  }

  // 盤面の縁(x/yが0またはGRID-1のマス)は配置・侵入不可の「壁」として扱う。
  function isEdgeCell(x, y, GRID) {
    return x <= 0 || x >= GRID - 1 || y <= 0 || y >= GRID - 1;
  }

  function nearestEnemy(units, u) {
    let best = null, bestDist = Infinity;
    for (const o of units) {
      if (o.hp <= 0 || o.team === u.team) continue;
      const d = Math.abs(o.x - u.x) + Math.abs(o.y - u.y);
      if (d < bestDist) { bestDist = d; best = o; }
    }
    return { target: best, dist: bestDist };
  }

  // Advances the simulation by one step: every living unit acts once
  // (attack if in range, otherwise move toward its nearest enemy).
  // Mutates `units` in place (hp/x/y). Does not touch the DOM or check win/loss.
  function tick(units, obstacles, GRID) {
    const order = units.filter(u => u.hp > 0);
    for (const u of order) {
      if (u.hp <= 0) continue;
      const { target, dist } = nearestEnemy(units, u);
      if (!target) continue;

      if (dist <= u.range) {
        target.hp -= u.atk;
        if (u.splash) {
          for (const other of units) {
            if (other.hp <= 0 || other.team === u.team || other.id === target.id) continue;
            const d = Math.abs(other.x - target.x) + Math.abs(other.y - target.y);
            if (d === 1) other.hp -= Math.ceil(u.atk / 2);
          }
        }
      } else {
        const dx = Math.sign(target.x - u.x);
        const dy = Math.sign(target.y - u.y);
        const moves = [];
        if (dx !== 0) moves.push([u.x + dx, u.y]);
        if (dy !== 0) moves.push([u.x, u.y + dy]);

        let moved = false;
        for (const [nx, ny] of moves) {
          if (nx >= 0 && nx < GRID && ny >= 0 && ny < GRID && !isEdgeCell(nx, ny, GRID) && !occupied(units, nx, ny) && !isObstacleCell(obstacles, nx, ny)) {
            u.x = nx; u.y = ny;
            moved = true;
            break;
          }
        }

        // fallback: primary route blocked (obstacle/unit) — try any open adjacent cell
        // so units never get permanently stuck against terrain
        if (!moved) {
          const fallback = [[u.x + 1, u.y], [u.x - 1, u.y], [u.x, u.y + 1], [u.x, u.y - 1]];
          for (const [nx, ny] of fallback) {
            if (nx >= 0 && nx < GRID && ny >= 0 && ny < GRID && !isEdgeCell(nx, ny, GRID) && !occupied(units, nx, ny) && !isObstacleCell(obstacles, nx, ny)) {
              u.x = nx; u.y = ny;
              break;
            }
          }
        }
      }
    }
  }

  function allyAlive(units) { return units.some(u => u.team === 'ally' && u.hp > 0); }
  function enemyAlive(units) { return units.some(u => u.team === 'enemy' && u.hp > 0); }

  window.Battle = {
    TYPES,
    TYPE_KEYS,
    makeUnit,
    reviveUnit,
    occupied,
    isObstacleCell,
    isEdgeCell,
    nearestEnemy,
    tick,
    allyAlive,
    enemyAlive,
  };
})();
