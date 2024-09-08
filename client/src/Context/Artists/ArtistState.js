import { createContext, useContext } from "react";
import { AlertContext } from "../Alert/AlertState";

const ArtistContext = createContext();
export { ArtistContext };

const ArtistState = (props) => {
  //context
  const { showAlert } = useContext(AlertContext);

  //states

  //variables
  const host = process.env.REACT_APP_HOST;

  //functions
  const fetchArtists = async ({ artistShortID, countOfArtists }) => {
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
  };

  return (
    <ArtistContext.Provider value={{ fetchArtists }}>
      {props.children}
    </ArtistContext.Provider>
  );
};
export default ArtistState;
