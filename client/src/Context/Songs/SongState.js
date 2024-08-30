import { useContext, useState } from "react";

import { createContext } from "react";
import { AlertContext } from "../Alert/AlertState";
const SongContext = createContext();
export { SongContext };

const SongState = (props) => {
  // let [songList, setSongList] = useState([
  //   {
  //     title: "Apna Bana Le",
  //     filePath: "./songs/apna bana le.m4a",
  //     coverImage: "./songs/Bhediya-Hindi-2023-20230927155213-500x500.jpg",
  //     album: "Bhediya",
  //     artist: "Sachin-Jigar , Arijit Singh",
  //     releaseDate: "2023",
  //     id: "70c62951-4bec-463f-bf3b-08a60fea82a5",
  //   },
  //   {
  //     title: "Chal Wahan Jaate Hain",
  //     filePath: "./songs/Chal-Wahan-Jaate-Hain.m4a",
  //     coverImage: "./songs/Chal-Wahan-Jaate-Hain.jpg",
  //     album: "",
  //     artist: "Arijit Singh",
  //     releaseDate: "2015",
  //     id: "70c62951-4bec-463f-bf3b-08a00fea82a9",
  //   },
  //   {
  //     title: "Chal Tere Ishq Mein",
  //     filePath: "./songs/Chal Tere Ishq Mein.m4a",
  //     coverImage: "./songs/Chal-Tere-Ishq-Mein.jpg",
  //     album: "",
  //     artist:
  //       "Mithoon , Neeti Mohan , Vishal Mishra , Shehnaz Akhtar , Sahil Akhtar",
  //     releaseDate: "2023",
  //     id: "d4038145-9617-4770-ae51-1bef9d2a2645",
  //   },
  //   {
  //     title: "Chaleya",
  //     filePath: "./songs/chaleya.m4a",
  //     coverImage: "./songs/chaleya.jpg",
  //     album: "Jawan",
  //     artist: " Anirudh Ravichander, Arijit Singh, Shilpa Rao",
  //     releaseDate: "2023",
  //     id: "1675546b-5dc3-478b-b9f8-156faefc7a08",
  //   },
  //   {
  //     title: "Diwali",
  //     filePath: "./songs/diwali.m4a",
  //     coverImage: "./songs/diwali.jpg",
  //     album: "Apurva",
  //     artist: "Vishal Mishra",
  //     releaseDate: "2023",
  //     id: "8623bf86-77a2-4462-a1c7-1e85576c71c5",
  //   },
  //   {
  //     title: "Gaddi Kaali",
  //     filePath: "./songs/gaddi kaali.m4a",
  //     coverImage: "./songs/Gaadi-Kaali-Punjabi-2023-20231005101228-500x500.jpg",
  //     album: "",
  //     artist: "Neha Kakkar , Rohanpreet Singh , Saga Sounds , Raees",
  //     releaseDate: "2023",
  //     id: "0e088a99-49a1-40ec-bfd5-9859de03d5f9",
  //   },
  //   {
  //     title: "Hass Hass ",
  //     filePath: "./songs/HassHass.m4a",
  //     coverImage: "./songs/HassHass.jpg",
  //     album: "",
  //     artist: "Diljit Dosanjh , Sia , Greg Kurstin",
  //     releaseDate: "2023",
  //     category: "punjabi",
  //     id: "006552c2-d4a3-46d1-8b73-b7216ce82528",
  //   },
  //   {
  //     title: "Heeriye",
  //     filePath: "./songs/heeriye.m4a",
  //     coverImage:
  //       "./songs/Heeriye-feat-Arijit-Singh-Hindi-2023-20230928050405-500x500.jpg",
  //     album: "",
  //     artist: "Dulquer Salmaan , Jasleen Royal , Arijit Singh",
  //     releaseDate: "2023",
  //     id: "64525833-cd79-4f3e-bc12-c946a250be20",
  //   },
  //   {
  //     title: "Leke Prabhu Ka Naam",
  //     filePath: "./songs/LekePrabhuKaNaam.m4a",
  //     coverImage:
  //       "./songs/Leke-Prabhu-Ka-Naam-From-Tiger-3-Hindi-2023-20231023111427-500x500.jpg",
  //     album: "Tiger 3",
  //     artist: "Pritam , Arijit Singh , Nikhita Gandhi , Amit",
  //     releaseDate: "2023",
  //     id: "0d00a7ee-62b3-4edd-958c-54777ba43243",
  //   },
  //   {
  //     title: "Mi Amor ",
  //     filePath: "./songs/mi amor.m4a",
  //     coverImage: "./songs/mi-amor.jpg",
  //     album: "",
  //     artist: " Sharn and 40K and The Paul",
  //     releaseDate: "2023",
  //     category: "punjabi",
  //     id: "7f894ae9-f609-48c4-aa98-639d9949060a",
  //   },
  //   {
  //     title: "Oonchi Oonchi Deewarein",
  //     filePath: "./songs/oonchi-oonchi.m4a",
  //     coverImage:
  //       "./songs/Oonchi-Oonchi-Deewarein-From-Yaariyan-2-Hindi-2023-20230919183037-500x500.jpg",
  //     album: "Yaariyan 2",
  //     artist: "Manan Bhardwaj , Arijit Singh",
  //     releaseDate: "2023",
  //     id: "d1e2297b-0635-4b86-8e4b-a3c024f41ec3",
  //   },
  //   {
  //     title: "Satranga",
  //     filePath: "./songs/Satranga.m4a",
  //     coverImage: "./songs/Satranga.jpg",
  //     album: "Animal",
  //     artist: "Arijit Singh , Shreyas Puranik , Siddharth Garima",
  //     releaseDate: "2023",
  //     id: "80869743-b768-439c-8911-965789f1e271",
  //   },
  //   {
  //     title: "Softly ",
  //     filePath: "./songs/softly.m4a",
  //     coverImage: "./songs/softly.jpg",
  //     album: "",
  //     artist: " Karan Aujla , IKKY",
  //     releaseDate: "2023",
  //     category: "punjabi",
  //     id: "bf1b54a5-b858-4ee3-b133-19c59d8aa656",
  //   },
  //   {
  //     title: "Thoda Thoda Pyar ",
  //     filePath: "./songs/ThodaThodaPyaar.m4a",
  //     coverImage: "./songs/ThodaThodaPyaar.jpg",
  //     album: "",
  //     artist: "Stebin Ben",
  //     releaseDate: "2023",
  //     id: "d5f49c48-0379-46aa-9c51-d81de4052bac",
  //   },
  //   {
  //     title: "Watch Out",
  //     filePath: "./songs/WatchOut.m4a",
  //     coverImage: "./songs/WatchOut.jpg",
  //     album: "",
  //     artist: " Sidhu Moose Wala , Sikander Kahlon , MXRCI",
  //     releaseDate: "2023",
  //     id: "02a1d085-9848-4e09-adc2-358dcf5cd5c2",
  //   },
  //   {
  //     title: "Baby",
  //     filePath: "./songs/baby.m4a",
  //     coverImage:
  //       "./songs/My-World-2-0-English-2010-20200606003742-500x500.jpg",
  //     album: "",
  //     artist: "Justin Bieber",
  //     releaseDate: "2022",
  //     id: "87eb9a52-d1bd-4d73-8e9f-1b9c3dffc0fa",
  //   },
  //   {
  //     title: "Barish Mein Tum",
  //     filePath: "./songs/Barish.m4a",
  //     coverImage:
  //       "./songs/Baarish-Mein-Tum-Hindi-2022-20220902211010-500x500.jpg",
  //     album: "",
  //     artist: "Neha Kakkar , Rohanpreet Singh , Harsh Kargeti",
  //     releaseDate: "2022",
  //     id: "4262e777-e6d2-4e45-91e9-ed8f0152f542",
  //   },
  //   {
  //     title: "Bhool Bhulaiyaa 2 Title Track Remix",
  //     filePath: "./songs/party/Bhool.m4a",
  //     coverImage:
  //       "./songs/party/Bhool-Bhulaiyaa-2-Title-Track-From-Bhool-Bhulaiyaa-2-Hindi-2022-20220502201002-500x500.jpg",
  //     album: "Bhool Bhulaiyaa 2",
  //     artist: "Yogii, Neeraj Shridhar, Mellow D, Bob, Pritam, Tanishk Bagchi",
  //     releaseDate: "2022",
  //     id: "8f010b73-e90f-42e4-a6ff-b9a4c806c3e0",
  //   },
  //   {
  //     title: "Jhoome Jo Pathaan",
  //     filePath: "./songs/party/Pathaan.m4a",
  //     coverImage: "./songs/party/Pathaan-Hindi-2022-20221222104158-500x500.jpg",
  //     album: "Pathaan",
  //     artist:
  //       "Vishal & Shekhar , Arijit Singh , Sukriti Kakar , Vishal Dadlani , Shekhar Ravjiani , Kumaar",
  //     releaseDate: "2022",
  //     id: "7c0a959d-e9bf-4617-a56a-76a778a85a46",
  //   },
  //   {
  //     title: "White-Brown",
  //     filePath: "./songs/white brown balck.m4a",
  //     coverImage: "./songs/white-brown-balck.jpg",
  //     album: "",
  //     artist: " Jaani , Avvy Sra , Karan Aujla",
  //     releaseDate: "2022",
  //     id: "daeccdec-7173-4d1e-b03d-f5e6b544c22d",
  //   },
  //   {
  //     title: "Nadiyon Paar",
  //     filePath: "./songs/Dance/Nadiyon.m4a",
  //     coverImage:
  //       "./songs/Dance/Nadiyon-Paar-Let-the-Music-Play-Again-From-Roohi--Hindi-2021-20210303125809-500x500.jpg",
  //     album: "Roohi",
  //     artist: "Sachin-Jigar",
  //     releaseDate: "2021",
  //     id: "d0b1a31c-83b7-4802-9e7b-103a49021013",
  //   },
  //   {
  //     title: "Peaches",
  //     filePath: "./songs/peaches.m4a",
  //     coverImage: "./songs/Justice-English-2021-20210325102906-500x500.jpg",
  //     album: "",
  //     artist: "Justin Bieber",
  //     releaseDate: "2021",
  //     id: "8e0326f1-7923-4844-a7d3-6830ff8ef9e0",
  //   },
  //   {
  //     title: "Stay",
  //     filePath: "./songs/stay.m4a",
  //     coverImage: "./songs/Stay-English-2021-20210706223809-500x500.jpg",
  //     album: "",
  //     artist:
  //       " The Kid Laroi , Justin Bieber ft. The Kid LAROI & Justin Bieber ,Cashmere Cat",
  //     releaseDate: "2021",
  //     id: "599304ed-48c2-4dce-9c7d-5239969770c0",
  //   },
  //   {
  //     title: "Vaaste",
  //     filePath: "./songs/vaaste.m4a",
  //     coverImage: "./songs/vaaste.jpg",
  //     album: "",
  //     artist:
  //       "Nikhil D'souza , Dhvani Bhanushali , Tanishk Bagchi ft. Nikhil D'souza",
  //     releaseDate: "2021",
  //     id: "840bd361-fdd2-4847-9911-78cbba682376",
  //   },
  //   {
  //     title: "Ghost",
  //     filePath: "./songs/international/Ghost.m4a",
  //     coverImage: "./songs/international/Ghost.jpg",
  //     album: "",
  //     artist: "Justin Bieber",
  //     releaseDate: "2021",
  //     category: "international",
  //     id: "e9fee046-54f2-46b5-a90e-773b8b08168e",
  //   },
  //   {
  //     title: "Apna Time Aayega",
  //     filePath: "./songs/Apna-Time-Aayega.m4a",
  //     coverImage: "./songs/Apna-Time-Aayega.jpg",
  //     album: "Gully Boy",
  //     artist: "Ranveer Singh , Dub Sharma , DIVINE",
  //     releaseDate: "2020",
  //     id: "cc804bc4-0175-49a7-b4b9-a30e79a6f58c",
  //   },
  //   {
  //     title: "Taaron Ke Saher",
  //     filePath: "./songs/taaron ka saher.m4a",
  //     coverImage:
  //       "./songs/Taaron-Ke-Shehar-Hindi-2020-20200920035507-500x500.jpg",
  //     album: "",
  //     artist: "Neha Kakkar , Jubin Nautiyal , Jaani",
  //     releaseDate: "2020",
  //     id: "b6f28dd2-0008-40dd-89a6-c839cbeb5081",
  //   },
  //   {
  //     title: "Intention",
  //     filePath:
  //       "./songs/international/Intentions-English-2020-20200207033302-500x500.m4a",
  //     coverImage:
  //       "./songs/international/Intentions-English-2020-20200207033302-500x500.jpg",
  //     album: "",
  //     artist: "Justin Bieber , Quavo",
  //     releaseDate: "2020",
  //     category: "international",
  //     id: "8bf356b6-6f84-4d99-8f25-858cc9828d42",
  //   },
  //   {
  //     title: "Stuck",
  //     filePath: "./songs/international/Stuck.m4a",
  //     coverImage:
  //       "./songs/international/Stuck-with-U-English-2020-20200508041707-500x500.jpg",
  //     album: "",
  //     artist: "Justin Bieber , Arian Grande",
  //     releaseDate: "2020",
  //     category: "international",
  //     id: "c542afcb-91a5-44bf-9128-8527026fc4a0",
  //   },
  //   {
  //     title: "Kalaastar",
  //     filePath: "./songs/kalaastar.m4a",
  //     coverImage: "./songs/kalaastar.jpg",
  //     album: "",
  //     artist: "Yo Yo Honey Singh",
  //     releaseDate: "2020",
  //     category: "",
  //     id: "7368c232-d660-4f80-bddb-023a5b246657",
  //   },
  //   {
  //     title: "Yaalgar",
  //     filePath: "./songs/Yalgaar.m4a",
  //     coverImage: "./songs/Yalgaar.jpg",
  //     album: "",
  //     artist: "Ajey Nagar , Wily Frenzy",
  //     releaseDate: "2020",
  //     category: "",
  //     id: "f48cab60-261e-4b22-82ad-4fdb86a03fa9",
  //   },
  //   {
  //     title: "8 Parche",
  //     filePath: "./songs/8 parche.m4a",
  //     coverImage: "./songs/8-parche.jpg",
  //     album: "",
  //     artist: "Baani Sandhu , Gur Sidhu",
  //     releaseDate: "2019",
  //     category: "punjabi",
  //     id: "3bab097e-c4a1-4b2f-bf46-1eda2f8af8eb",
  //   },
  //   {
  //     title: "Aashiq Banaya Aapne",
  //     filePath: "./songs/ashiq.m4a",
  //     coverImage: "./songs/Hate-Story-IV-Hindi-2018-20180223-500x500.jpg",
  //     album: "",
  //     artist: "Himesh Reshammiya , Neha Kakkar",
  //     releaseDate: "2019",
  //     id: "15da2dec-402c-43d4-84dd-8c5c3b4dd078",
  //   },
  //   {
  //     title: "Dance Like",
  //     filePath: "./songs/Dance/Dance.m4a",
  //     coverImage:
  //       "./songs/Dance/Dance-Like-Punjabi-2019-20191130051515-500x500.jpg",
  //     album: "",
  //     artist: "Harrdy Sandhu, Jaani ",
  //     releaseDate: "2019",
  //     category: "punjabi",
  //     id: "32dc2b6d-03e8-430d-80c2-d74376c81246",
  //   },
  //   {
  //     title: "Ghungroo",
  //     filePath: "./songs/party/War.m4a",
  //     coverImage: "./songs/party/War-Hindi-2019-20191001104931-500x500.jpg",
  //     album: "War",
  //     artist: "Vishal & Shekhar , Arijit Singh , Shilpa Rao , Kumaar",
  //     releaseDate: "2019",
  //     id: "e7a57057-a944-473d-bf88-8912afb87847",
  //   },
  //   {
  //     title: "Hawa Banke",
  //     filePath: "./songs/Hawa-Banke.m4a",
  //     coverImage: "./songs/Hawa-Banke.jpg",
  //     album: "",
  //     artist: "Darshan Raval , Simran Choudhary",
  //     releaseDate: "2019",
  //     id: "2c380811-3305-4c92-af53-7d31beae014a",
  //   },
  //   {
  //     title: "Khud-Se-Zyada",
  //     filePath: "./songs/Khud-Se-Zyada.m4a",
  //     coverImage: "./songs/Khud-Se-Zyada.jpg",
  //     album: "",
  //     artist: "Tanishk Bagchi , Zara Khan",
  //     releaseDate: "2019",
  //     id: "6e28caf1-adac-42a8-9ccd-5d8fcd4ca68b",
  //   },
  //   {
  //     title: "King Of Indian Hip Hop",
  //     filePath: "./songs/King-Of-Indian-Hip-Hop-Hindi.m4a",
  //     coverImage: "./songs/King-Of-Indian-Hip-Hop-Hindi.jpg",
  //     album: "",
  //     artist: "Emiway Bantai",
  //     releaseDate: "2019",
  //     id: "55d6af22-e98b-470d-bc1c-dec6c35b655d",
  //   },
  //   {
  //     title: "Paagal",
  //     filePath: "./songs/Paagal.m4a",
  //     coverImage: "./songs/Paagal.jpg",
  //     album: "",
  //     artist: "Badshah",
  //     releaseDate: "2019",
  //     id: "99a889f1-40e4-4d1a-be7e-f72cacdd6143",
  //   },
  //   {
  //     title: "Tere Do Naina",
  //     filePath: "./songs/Tere-Do-Naina.m4a",
  //     coverImage: "./songs/Tere-Do-Naina.jpg",
  //     album: "",
  //     artist: "Gourov-Roshin ft. Ankit Tiwari",
  //     releaseDate: "2019",
  //     id: "ddbe425c-9f48-4e5e-bca2-ee6db731c738",
  //   },
  //   {
  //     title: "Tip Tip Barsa Paani - Hip Hop Remix",
  //     filePath: "./songs/TipTip.m4a",
  //     coverImage:
  //       "./songs/Tip-Tip-Barsa-Paani-Hip-Hop-Remix-Hindi-2019-20230608011454-500x500.jpg",
  //     album: "Mohra",
  //     artist: "Udit Narayan, Alka Yagnik",
  //     releaseDate: "1994",
  //     id: "fdc1e452-f7d3-4577-957b-c17d6652ecb7",
  //   },
  //   {
  //     title: "Yaad Piya Ki Aane Lagi",
  //     filePath: "./songs/ypkalh.m4a",
  //     coverImage:
  //       "./songs/Yaad-Piya-Ki-Aane-Lagi-Hindi-2019-20191116115736-500x500.jpg",
  //     album: "",
  //     artist: "Neha Kakkar , Tanishk Bagchi",
  //     releaseDate: "2019",
  //     id: "d2c48c52-be48-48d2-ba22-1b6fa4c97647",
  //   },
  //   {
  //     title: "Yummy",
  //     filePath: "./songs/yummy.m4a",
  //     coverImage: "./songs/Yummy-English-2020-20200103035142-500x500.jpg",
  //     album: "",
  //     artist: "Justin Bieber",
  //     releaseDate: "2019",
  //     id: "fa4fd405-af83-4a6f-81a8-26c17f98585d",
  //   },
  //   {
  //     title: "I-Don-t",
  //     filePath: "./songs/international/I-Don-t.m4a",
  //     coverImage:
  //       "./songs/international/I-Don-t-Care-English-2019-20190702110450-500x500.jpg",
  //     album: "",
  //     artist: "Ed Sheeran , Justin Bieber",
  //     releaseDate: "2019",
  //     category: "international",
  //     id: "dfea4aa6-a5ed-48c5-9f6e-7af385bf506f",
  //   },
  //   {
  //     title: "O Priya Priya",
  //     filePath: "./songs/oldSongs/OPriya.m4a",
  //     coverImage: "./songs/oldSongs/Dil-OPriya.jpg",
  //     album: "Dil",
  //     artist: "Anuradha Paudwal and Suresh Wadkar",
  //     releaseDate: "1990",
  //     category: "oldSongs",
  //     id: "c1137d7a-1fed-4c25-b2b5-96ea9aaa1cca",
  //   },
  //   {
  //     title: "Bom Diggy Diggy",
  //     filePath: "./songs/party/Sonu.m4a",
  //     coverImage:
  //       "./songs/party/Sonu-Ke-Titu-Ki-Sweety-Hindi-2018-20180214153942-500x500.jpg",
  //     album: "Sonu Ke Titu Ki Sweety",
  //     artist: "Jasmin Walia, Zack Knight",
  //     releaseDate: "2018",
  //     id: "e3ccea48-3f9f-47f7-bade-f8d4d327ccb6",
  //   },
  //   {
  //     title: "Kya Baat Ay",
  //     filePath: "./songs/Dance/Kya-Baat.m4a",
  //     coverImage:
  //       "./songs/Dance/Kya-Baat-Ay-Punjabi-2018-20180921123124-500x500.jpg",
  //     album: "",
  //     artist: "Harrdy Sandhu , Jaani ",
  //     releaseDate: "2018",
  //     category: "punjabi",
  //     id: "bdb89741-6eaf-4016-9a40-851dea84782f",
  //   },
  //   {
  //     title: "Makhna",
  //     filePath: "./songs/makhna.m4a",
  //     coverImage: "./songs/Makhna-Hindi-2018-20231116171053-500x500.jpg",
  //     album: "",
  //     artist: "Yo Yo Honey Singh , Neha Kakkar , Singhsta , Allistair",
  //     releaseDate: "2018",
  //     id: "9ff4ce99-eb67-4a01-8847-7d1b9c8f6602",
  //   },
  //   {
  //     title: "Proper Patola",
  //     filePath: "./songs/Dance/Namaste.m4a",
  //     coverImage:
  //       "./songs/Dance/Namaste-England-Hindi-2018-20181003055757-500x500.jpg",
  //     album: "",
  //     artist: "Badshah",
  //     releaseDate: "2018",
  //     category: "punjabi",
  //     id: "af7d37b2-0446-4be1-bb75-046360610b3e",
  //   },
  //   {
  //     title: "Dilbar",
  //     filePath: "./songs/dilbar.m4a",
  //     coverImage: "./songs/Satyameva-Jayate-Hindi-2018-20180801-500x500.jpg",
  //     album: "Satyameva Jayate",
  //     artist: "Amar Arshi , Badshah , Neha Kakkar",
  //     releaseDate: "2018",
  //     id: "672227fa-9ba1-4a8d-9ef5-0126323b2d46",
  //   },
  //   {
  //     title: "Jawan",
  //     filePath: "./songs/jawan.m4a",
  //     coverImage: "./songs/jawan.jpg",
  //     album: "Jawan",
  //     artist: "Anirudh Ravichander",
  //     releaseDate: "2023",
  //     id: "3cedd507-9a3d-473a-b98c-786341c82cc7",
  //   },
  //   {
  //     title: "Kala Chasma",
  //     filePath: "./songs/kala .m4a",
  //     coverImage:
  //       "./songs/Baar-Baar-Dekho-Hindi-2016-20181205114400-500x500.jpg",
  //     album: "",
  //     artist: "Amar Arshi , Badshah , Neha Kakkar",
  //     releaseDate: "2016",
  //     id: "1ca56ea4-950a-45b1-a7ba-3c8865d63f4d",
  //   },
  //   {
  //     title: "Phir Bhi Tumko Chaahunga",
  //     filePath: "./songs/pir bhi tumko chaunga.m4a",
  //     coverImage: "./songs/Half-Girlfriend-Hindi-2017-20180622-500x500.jpg",
  //     album: "Half Girlfriend",
  //     artist: " Mithoon , Arijit Singh , Shashaa Tirupati",
  //     releaseDate: "2017",
  //     id: "52687bb6-288f-4c12-85cc-a6c55a0f39a9",
  //   },
  //   {
  //     title: "Afghan Jalebi (Ya Baba)",
  //     filePath: "./songs/Dance/Phantom.m4a",
  //     coverImage: "./songs/Dance/Phantom-Hindi-2015-500x500.jpg",
  //     album: "",
  //     artist: "Pritam, Asrar, Akhtar Channal",
  //     releaseDate: "2015",
  //     id: "ca0739b4-64ee-4068-af75-4b7432e426c1",
  //   },
  //   {
  //     title: "Purpose",
  //     filePath: "./songs/international/Purpose.m4a",
  //     coverImage: "./songs/international/Purpose-English-2015-500x500.jpg",
  //     album: "",
  //     artist: "Justin Bieber",
  //     releaseDate: "2015",
  //     category: "international",
  //     id: "dc69ed98-41b5-4878-91a0-a32d9da15b19",
  //   },
  //   {
  //     title: "Aao Raja -Gabbar is back",
  //     filePath: "./songs/gabbar-is-back.m4a",
  //     coverImage: "./songs/gabbar-is-back.jpg",
  //     album: "",
  //     artist:
  //       "Chirantan Bhatt , Yo Yo Honey Singh , Manj Musik , Neha Kakkar , Sandeep Chowta , Amar Mohile",
  //     releaseDate: "2015",
  //     category: "",
  //     id: "3be3987e-73c6-45ab-8712-06a021a7c4f0",
  //   },
  //   {
  //     title: "Desi Kalakaar",
  //     filePath: "./songs/Desi-Kalakaar.m4a",
  //     coverImage: "./songs/Desi-Kalakaar.jpg",
  //     album: "",
  //     artist: "Yo Yo Honey Singh",
  //     releaseDate: "2014",
  //     id: "3fcef096-87c9-4342-bffd-76ecbfc4bff0",
  //   },
  //   {
  //     title: "Issey Kehte Hain Hip Hop",
  //     filePath: "./songs/Issey-Kehte-Hain-Hip-Hop-Hindi.m4a",
  //     coverImage: "./songs/Issey-Kehte-Hain-Hip-Hop-Hindi-2014-500x500.jpg",
  //     album: "",
  //     artist: "Yo Yo Honey Singh, Lil Golu",
  //     releaseDate: "2014",
  //     id: "3625bb15-0697-4f5e-8e0c-ea31e84e485a",
  //   },
  //   {
  //     title: "Kamariya",
  //     filePath: "./songs/party/Stree.m4a",
  //     coverImage: "./songs/party/Stree-Hindi-2018-20180822-500x500.jpg",
  //     album: "Stree",
  //     artist: "Aastha Gill , Jigar Saraiya , Divya Kumar , Sachin Sanghvi",
  //     releaseDate: "2018",
  //     id: "0ca4450c-b1ce-4f17-83fd-d42f5cae83bd",
  //   },
  //   {
  //     title: "Manali Trance",
  //     filePath: "./songs/Manali-Trance.m4a",
  //     coverImage: "./songs/Manali-Trance.jpg",
  //     album: "The Shaukeens",
  //     artist: "Lil Golu , Neha Kakkar",
  //     releaseDate: "2014",
  //     id: "fb64ead2-54a7-4f28-a7b5-f3dafe43d406",
  //   },
  //   {
  //     title: "Tum Hi Ho",
  //     filePath: "./songs/tum hi ho.m4a",
  //     coverImage: "./songs/Aashiqui-2-Hindi-2013-500x500.jpg",
  //     album: "",
  //     artist: " Arijit Singh",
  //     releaseDate: "2013",
  //     id: "97c71f13-af76-4398-bae2-46e71066b71c",
  //   },
  //   {
  //     title: "Chammak Challo",
  //     filePath: "./songs/Dance/Ra-One.m4a",
  //     coverImage: "./songs/Dance/Ra-One-Hindi-2011-500x500.jpg",
  //     album: "",
  //     artist: "Vishal & Shekhar, Akon",
  //     releaseDate: "2011",
  //     id: "06afcf57-4f53-4ad5-a7c0-6a11bc0751a4",
  //   },
  //   {
  //     title: "Eenie",
  //     filePath: "./songs/international/Eenie.m4a",
  //     coverImage: "./songs/international/Eenie-Meenie-2010-500x500.jpg",
  //     album: "",
  //     artist: "Sean Kingston",
  //     releaseDate: "2010",
  //     category: "international",
  //     id: "923a62ed-4ec5-474f-b681-11e7eac9617e",
  //   },
  //   {
  //     title: "Love Me",
  //     filePath: "./songs/international/Love.m4a",
  //     coverImage: "./songs/international/Love.jpg",
  //     album: "",
  //     artist: "Justin Bieber",
  //     releaseDate: "2009",
  //     category: "international",
  //     id: "b3a62fd1-3b4f-4c41-9cae-bda0b0aa1786",
  //   },
  //   {
  //     title: "Tumse Mil K Dil Ka Haal",
  //     filePath: "./songs/tumseMilKDilKaHaal.mp3",
  //     coverImage: "./songs/tumseMilKDilKaHaal.jpg",
  //     album: "Main Hoon Na",
  //     artist: "Sonu Nigam , Sabri Brothers",
  //     releaseDate: "2004",
  //     id: "a4ff35c6-9939-489a-a65c-5204191c86c2",
  //   },
  //   {
  //     title: "Lal Dupptaa",
  //     filePath: "./songs/oldSongs/Lal.m4a",
  //     coverImage:
  //       "./songs/oldSongs/Lal-Dupatta-Malmal-Ka-Hindi-1990-20221208021455-500x500.jpg",
  //     album: "Mujhse Shaadi Karogi",
  //     artist: "Alka Yagnik and Udit Narayan",
  //     releaseDate: "2004",
  //     category: "oldSongs",
  //     id: "0a1fd1be-f208-49b9-acf9-65acaf37be69",
  //   },
  //   {
  //     title: "Aati Kya Khandala",
  //     filePath: "./songs/oldSongs/Ghulam.m4a",
  //     coverImage:
  //       "./songs/oldSongs/Ghulam-Hindi-1998-20230304134505-500x500.jpg",
  //     album: "Ghulam",
  //     artist: "Aamir Khan, Alka Yagnik",
  //     releaseDate: "1998",
  //     category: "oldSongs",
  //     id: "9401b5d6-cfcd-4e2c-ac21-415a82a16954",
  //   },
  //   {
  //     title: "Main Toh Raste Se Ja Raha Tha",
  //     filePath: "./songs/oldSongs/Coolie.m4a",
  //     coverImage:
  //       "./songs/oldSongs/Coolie-No-1-Hindi-1995-20230804160904-500x500.jpg",
  //     album: "Coolie No. 1",
  //     artist: "Alka Yagnik , Kumar Sanu",
  //     releaseDate: "1995",
  //     category: "oldSongs",
  //     id: "7e9340a0-c6ab-48be-af1e-45cc12ea542f",
  //   },
  //   {
  //     title: "Ek Ladki Ko Dekha ( Kumar Sanu)",
  //     artist: "Kumar Sanu",
  //     album: "1942: A Love Story",
  //     genre: "romance/comedy",
  //     releaseDate: "1994",
  //     filePath: "./songs/EkLadkiKoDekha(KumarSanu).m4a",
  //     coverImage: "./songs/EkLadkiKoDekha(KumarSanu).jpg",
  //     id: "dc63faf8-51ad-49a1-87e3-291407e3f851",
  //   },
  //   {
  //     title: "Kitne Dino Ke Baad Hai Aayi",
  //     filePath: "./songs/oldSongs/Kitne-Dino-Ke-Baad-Hai-Aayi.m4a",
  //     coverImage: "./songs/oldSongs/Kitne-Dino-Ke-Baad-Hai-Aayi.jpg",
  //     album: "Ayee Milan Ki Raat",
  //     genre: "Romance/Musical",
  //     artist: "Anuradha Paudwal,Mohammed Aziz, Anand-Milind, Sameer Anjaan ",
  //     releaseDate: "1991",
  //     category: "oldSongs",
  //     id: "baa01ad5-1bea-4844-97f4-d5788bc202c3",
  //   },
  //   {
  //     title: "O Priya Priya",
  //     filePath: "./songs/oldSongs/Dil.m4a",
  //     coverImage: "./songs/oldSongs/Dil-OPriya.jpg",
  //     album: "Dil",
  //     artist: "",
  //     releaseDate: "1990",
  //     category: "oldSongs",
  //     id: "158ca278-3ec5-4852-89f8-dda071c294d2",
  //   },
  //   {
  //     title: "Tumhein Dil Se Kaise Juda Hum Karenge",
  //     filePath: "./songs/oldSongs/Doodh.m4a",
  //     coverImage:
  //       "./songs/oldSongs/Doodh-Ka-Karz-Hindi-1990-20221207235458-500x500.jpg",
  //     album: "Doodh Ka Karz",
  //     artist: "Anuradha Paudwal,Mohammed Aziz",
  //     releaseDate: "1990",
  //     category: "oldSongs",
  //     id: "5f21ba72-d8f0-4902-9d2d-1d2f63e4b519",
  //   },
  // ]);
  let [songList, setSongList] = useState([]);
  const host = process.env.REACT_APP_HOST;
  const [songDetails, setSongDetails] = useState();
  const { showAlert } = useContext(AlertContext);
  const fetchSongs = async (queryParams) => {
    try {
      let url = new URL(`${host}/songs/get/all`);
      if (queryParams) {
        Object.keys(queryParams).forEach((key) =>
          url.searchParams.append(key, queryParams[key])
        );
      }
      url = url.toString();

      const response = await fetch(url, { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setSongList(data.songs);
        return true;
      } else {
        console.error(data.error);
        showAlert(data.error);
        return false;
      }
    } catch (error) {
      showAlert("Error fetching the songs");
      return false;
    }
  };

  let newReleaseFunc = async () => {
    try {
      let url = new URL(`${host}/songs/get/newrelease`);
      url = url.toString();

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        return data.songs;
      } else {
        console.error(data.error);
        showAlert(data.error);
        return null;
      }
    } catch (error) {
      showAlert("Error fetching the songs");
      return null;
    }
  };

  let oldReleaseFunc = async () => {
    try {
      let url = new URL(`${host}/songs/get/oldsongs`);
      url = url.toString();

      const response = await fetch(url, { method: "GET" });
      const data = await response.json();
      if (response.ok) {
        return data.songs;
      } else {
        console.error(data.error);
        showAlert(data.error);
        return null;
      }
    } catch (error) {
      showAlert("Error fetching the songs");
      return null;
    }
  };

  let handlePunjabiFunc = (range) => {
    let newList = songList
      .filter((curr) =>
        curr.category && curr.category === "punjabi" ? curr : null
      )
      .sort((a, b) => b.year - a.year);
    let length = range ? range : newList.length;
    newList = newList.slice(0, length);
    return newList;
  };

  let handleWestTunesFunc = (range) => {
    let newList = songList
      .filter((curr) =>
        curr.category && curr.category === "international" ? curr : null
      )
      .sort((a, b) => b.year - a.year);
    let length = range ? range : newList.length;
    newList = newList.slice(0, length);
    return newList;
  };

  let getDetails = (song) => {
    console.log(song);
  };

  return (
    <SongContext.Provider
      value={{
        fetchSongs,
        newReleaseFunc,
        oldReleaseFunc,
        handlePunjabiFunc,
        handleWestTunesFunc,
        getDetails,
        songDetails,
        setSongDetails,
        songList,
      }}
    >
      {props.children}
    </SongContext.Provider>
  );
};
export default SongState;
