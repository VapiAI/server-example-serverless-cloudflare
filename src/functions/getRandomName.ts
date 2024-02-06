const nats = [
  "AU",
  "CA",
  "FR",
  "IN",
  "IR",
  "MX",
  "NL",
  "NO",
  "NZ",
  "RS",
  "TR",
  "US",
];

interface NameParams {
  gender?: "male" | "female";
  nat?: (typeof nats)[number];
}

export const getRandomName = async (params: NameParams) => {
  let nat =
    params.nat && !nats.includes(params.nat.toUpperCase())
      ? nats[Math.floor(Math.random() * nats.length)]
      : params.nat ?? "";

  const queryParams = new URLSearchParams({
    ...params,
    nat,
  }).toString();

  try {
    const response = await fetch(`https://randomuser.me/api/?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: any = await response.json();
    const name = data.results[0].name;
    console.log("results", params, name);
    return {
      result: name.first + " " + name.last,
    };
  } catch (err) {
    throw new Error("Error fetching random name");
  }
};
