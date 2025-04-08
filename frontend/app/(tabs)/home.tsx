import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList, ImageBackground } from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { textStyles } from "../stylesheets/textStyles";
import Buttons from "../components/buttons";
import { useTimeTracker } from "../hooks/useTimeTracker";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const testSubjects = [
  {
    id: "1",
    type: "book",
    image: "https://i5.walmartimages.com/seo/Harry-Potter-and-the-Chamber-of-Secrets-9780807281949_57baa93a-bf72-475f-a16a-a8a68527b723.8bcd0fed9c3a1130f7ead9251ea885be.jpeg",
    title: "Harry Potter and the Chamber of Secrets",
    author: "JK Rowling",
    link: 'https://www.barnesandnoble.com/w/harry-potter-and-the-chamber-of-secrets-j-k-rowling/1004338523?ean=9780439064866',
    summary: "Harry, a 2nd-year student at Hogwarts, starts hearing mysterious voices. When unusual tragedies occur, he and his friends search for answers.",
  },
  {
    id: "2",
    type: "news",
    image: "",
    title: "Chuck E. Cheese wants to be the Costco of family fun",
    author: "Savannah Sellers and Alexandra Byrne",
    link: 'https://www.nbcnews.com/business/consumer/chuck-e-cheese-wants-costco-family-fun-rcna195652',
    summary: "Chuck E. Cheese wants you to stop by as frequently as you pick up groceries, and it’s selling subscription plans to sweeten the pitch.",
  },
  {
    id: "3",
    type: "poem",
    title: "The Raven",
    author: "Edgar Allan Poe",
    poem: "Once upon a midnight dreary, While I pondered, weak and weary...",
  },
];

const API_BASE_URL = ""; // api config, empty for offline only

export default function Home() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [state, setState] = useState({ page: 0 });
  const [level, setLevel] = useState(0);
  // const [percent, setPercent] = useState(50);
  const [percent, setPercent] = useState(0);
  const [viewedCategories, setViewedCategories] = useState<Set<string>>(new Set());
  const [dailyGoal, setDailyGoal] = useState(30);
  const [timeReadToday, setTimeReadToday] = useState(0);
  const [like, setLike] = useState<"heart-outline" | "heart">("heart-outline");
  const [favorite, setFavorite] = useState<"bookmark-outline" | "bookmark">("bookmark-outline");

  // Time tracking for different categories
  const booksTracker = useTimeTracker("books");
  const poemsTracker = useTimeTracker("poem");
  const newsTracker = useTimeTracker("news");

  useEffect(() => {
    const loadProgress = async () => {
      const localData = await AsyncStorage.getItem("userProgress");
      if (localData) {
        const { level, percent, viewedCategories, dailyGoal, timeReadToday } = JSON.parse(localData);
        setLevel(level || 0);
        setPercent(percent || 0);
        setViewedCategories(new Set(viewedCategories || []));
        setDailyGoal(dailyGoal || 30);
        setTimeReadToday(timeReadToday || 0);
      }
    };
    loadProgress();
  }, []);

  const saveProgress = async () => {
    const progressData = {
      viewedCategories: [...viewedCategories],
      dailyGoal,
      timeReadToday,
      level,
      percent
    };
    await AsyncStorage.setItem("userProgress", JSON.stringify(progressData));
  };

  // calculate updated progress
  useEffect(() => {
    // for every different category the user views, awards 26.6% per category to reach a 80% max
    const categoryProgress = (viewedCategories.size / 3) * 80; // adjust this once more categories are implemented

    // awards 20% for progress if daily reading goal is completed
    const goalProgress = timeReadToday >= dailyGoal ? 20 : 0; // const goalProgress = Math.min((timeReadToday / dailyGoal) * 67, 67);
    
    // 100% max
    const totalProgress = Math.round(categoryProgress + goalProgress);
    setPercent(totalProgress);
    if (totalProgress >= 100) {
      setLevel(prev => prev + 1);
      setPercent(0);
      saveProgress();
    }
  }, [viewedCategories, timeReadToday, dailyGoal]);

  const handleReadMore = (item: ItemProps) => {
    // track category
    const updatedCategories = new Set(viewedCategories).add(item.type);
    setViewedCategories(updatedCategories);

    // start timing
    if (item.type === "book") booksTracker.startTiming();
    else if (item.type === "poem") poemsTracker.startTiming();
    else if (item.type === "news") newsTracker.startTiming();

    router.push({ pathname: "/readMore", params: { item: JSON.stringify(item) } });
  };

  type ItemProps = {
    id: string,
    type: string,
    image?: string,
    title: string;
    author: string;
    summary?: string;
    poem?: string;
    link?: string;
  };

  const Item = ({ item }: { item: ItemProps }) => (
    <View style={styles.contentContainer}>
      <View style={styles.mediaTag}>
        <Text style={textStyles.subheadingWhite}>{item.type}</Text>
      </View>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <View style={{ padding: 10 }}>
        <Text style={textStyles.heading2purple}>{item.title}</Text>
        <Text style={[textStyles.subheading, { marginBottom: 20 }]}>By: {item.author}</Text>
        {item.type === "poem" ? (
          <Text style={textStyles.subheading}>{item.poem}</Text>
        ) : (
          <View>
            <Text style={textStyles.heading2purple}>Summary:</Text>
            <Text style={textStyles.subheading}>{item.summary}</Text>
          </View>
        )}
      </View>
      <View style={styles.pageButtons}>
        <View style={{ flexDirection: "row", flex: 1, marginRight: 100 }}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() =>
              setLike((prevIcon) => (prevIcon === "heart-outline" ? "heart" : "heart-outline"))
            }
          >
            <Ionicons name={like} size={30} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() =>
              setFavorite((prevIcon) =>
                prevIcon === "bookmark-outline" ? "bookmark" : "bookmark-outline"
              )
            }
          >
            <Ionicons name={favorite} size={27} color={"white"} />
          </TouchableOpacity>
        </View>
        <Buttons
          title="Read More"
          variant="purple"
          onPress={() => handleReadMore(item)} // Start timing based on type
        />
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/Homebg.png')}
      style={styles.imagebg}>
      <View style={styles.container}>
        <SwitchSelector
          initial={0}
          onPress={(value: number) => setState({ page: value })}
          textColor={"white"}
          selectedColor={"#413F6F"}
          backgroundColor={"#736F96"}
          buttonColor={"#E3E2EA"}
          borderColor={"#736F96"}
          hasPadding
          valuePadding={3}
          style={{ width: 200, marginTop: 50, marginBottom: 15 }}
          options={[
            { label: "For You", value: 0 },
            { label: "Explore", value: 1 },
          ]}
        />

        <FlatList
          data={testSubjects}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
          horizontal={false}
        />

        <View style={styles.lvlContainer}>
          <View style={styles.lvlBar}>
            <View style={[styles.lvlFill, { width: `${percent}%` }]} />
            {/* <Image
                      source={require('../../assets/images/fish.png')}
                      style={{alignSelf: "flex-end"}}
                    /> */}
          </View>
          <View style={styles.lvlText}>
            <Text style={[textStyles.pageHeader, { fontSize: 17 }]}>{percent}%</Text>
            <Text style={[textStyles.pageHeader, { fontSize: 17 }]}>LVL {level}</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "flex-start",
    textAlign: "center",
    height: 610,
    width: 370,
    marginBottom: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  lvlContainer: {
    borderRadius: 30,
    width: 370,
    height: 50,
    marginVertical: 15,
    alignItems: "center",
    flexDirection: "row",
  },
  lvlBar: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 4,
    borderRadius: 15,
    width: 370,
    height: 50,
    marginVertical: 15,
  },
  lvlFill: {
    backgroundColor: "white",
    borderRadius: 0,
    height: 42,
  },
  lvlText: {
    position: "absolute",
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 18,
  },
  image: {
    width: "100%",
    height: "25%",
  },
  circleButton: {
    width: 45,
    height: 45,
    borderRadius: 45,
    backgroundColor: "#413F6F",
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  pageButtons: {
    position: "absolute",
    bottom: 0,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  mediaTag: {
    width: "100%",
    height: 35,
    backgroundColor: "#736F96",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignSelf: "flex-end",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "space-around",
  },
  imagebg: {
    resizeMode: 'cover',
    width: '100%',
    height: undefined,
    aspectRatio: 0.51,
    flex: 1,
  },
});
