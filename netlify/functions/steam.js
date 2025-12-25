export async function handler() {
  const API_KEY = process.env.STEAM_API_KEY;
  const STEAM_ID = "76561199562793160"; // ← 改成你自己的 SteamID

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing STEAM_API_KEY" })
    };
  }

  const ownedGamesUrl =
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/` +
    `?key=${API_KEY}&steamid=${STEAM_ID}&include_appinfo=1`;

  const recentGamesUrl =
    `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/` +
    `?key=${API_KEY}&steamid=${STEAM_ID}`;

  try {
    const [ownedRes, recentRes] = await Promise.all([
      fetch(ownedGamesUrl),
      fetch(recentGamesUrl)
    ]);

    if (!ownedRes.ok || !recentRes.ok) {
      throw new Error("Steam API request failed");
    }

    const ownedData = await ownedRes.json();
    const recentData = await recentRes.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // 🔥 缓存 5 分钟，显著加快刷新速度
        "Cache-Control": "public, max-age=300"
      },
      body: JSON.stringify({
        games: ownedData.response.games || [],
        recent: recentData.response.games || []
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to fetch Steam data",
        detail: err.message
      })
    };
  }
}
