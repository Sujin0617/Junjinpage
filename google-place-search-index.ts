const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const key = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!key) throw new Error("GOOGLE_PLACES_API_KEY가 설정되지 않았어요.");

    const { query } = await req.json();
    const textQuery = String(query || "").trim();
    if (!textQuery) {
      return new Response(JSON.stringify({ error: "검색어를 입력해주세요." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const r = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.primaryTypeDisplayName"
      },
      body: JSON.stringify({
        textQuery,
        pageSize: 10,
        languageCode: "ko"
      })
    });

    const data = await r.json();
    if (!r.ok) {
      return new Response(JSON.stringify({ error: "Google 장소 검색에 실패했어요.", google: data }), {
        status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const places = (data.places || []).map((p: any) => ({
      id: p.id,
      name: p.displayName?.text || "",
      formattedAddress: p.formattedAddress || "",
      address: p.formattedAddress || "",
      latitude: p.location?.latitude ?? null,
      longitude: p.location?.longitude ?? null,
      googleMapsUri: p.googleMapsUri || "",
      categoryName: p.primaryTypeDisplayName?.text || "",
      provider: "google"
    }));

    return new Response(JSON.stringify({ success: true, places }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
