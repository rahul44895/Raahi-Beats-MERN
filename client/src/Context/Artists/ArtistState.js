import { createContext, useCallback, useContext, useRef } from "react";
import { AlertContext } from "../Alert/AlertState";

const ArtistContext = createContext();
export { ArtistContext };

const ArtistState = (props) => {
  //context
  const { showAlert } = useContext(AlertContext);

  //states

  //variables
  const host = process.env.REACT_APP_HOST;
  // Keyed by countOfArtists (never by search) so remounting the Artists page
  // doesn't re-fetch the same "top 10"/"all" lists it already has.
  const artistsCache = useRef({});

  //functions
  const fetchArtists = useCallback(
    async ({ artistShortID, countOfArtists }) => {
      const cacheKey = `count:${countOfArtists || "all"}`;
      if (!artistShortID && artistsCache.current[cacheKey]) {
        return artistsCache.current[cacheKey];
      }
      try {
        const url = artistShortID
          ? `${host}/artists/?search=${artistShortID}`
          : `${host}/artists/`;
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify({
            countOfArtists: countOfArtists ? countOfArtists : undefined,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          if (!artistShortID) artistsCache.current[cacheKey] = data.artists;
          return data.artists;
        } else {
          showAlert(data.error);
          return null;
        }
      } catch (error) {
        showAlert("Some error occured.");
        // console.error(error);
        return null;
      }
    },
    [host, showAlert]
  );

  return (
    <ArtistContext.Provider value={{ fetchArtists }}>
      {props.children}
    </ArtistContext.Provider>
  );
};
export default ArtistState;
