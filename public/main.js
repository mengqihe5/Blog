async function load() {
  const { games, recent } = await fetch("/api/steam").then(r => r.json());


  const recentMap = {};
  recent.forEach(g => {
    recentMap[g.appid] = g.playtime_2weeks || 0;
  });

  games
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .forEach(game => {
      const totalH = (game.playtime_forever / 60).toFixed(1);
      const twoWeeks = recentMap[game.appid] || 0;
      const ratio = Math.min(twoWeeks / game.playtime_forever, 1);

      const div = document.createElement("div");
      div.className = "game";
      div.innerHTML = `
        <img src="https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg">
        <div class="info">
          <h3>${game.name}</h3>
          <p>总时长：${totalH} h</p>
          <div class="bar">
            <div style="width:${ratio * 100}%"></div>
          </div>
        </div>
      `;
      document.getElementById("list").appendChild(div);
    });
}

load();
