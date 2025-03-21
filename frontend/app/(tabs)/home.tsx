import { useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import SwitchSelector from 'react-native-switch-selector';
import LinearGradient from 'react-native-linear-gradient';
import { textStyles } from "../stylesheets/textStyles";
import Buttons from "../components/buttons";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

const testSubjects = [
    {
        id: '1',
        type: 'book',
        image: 'https://i5.walmartimages.com/seo/Harry-Potter-and-the-Chamber-of-Secrets-9780807281949_57baa93a-bf72-475f-a16a-a8a68527b723.8bcd0fed9c3a1130f7ead9251ea885be.jpeg',
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'JK Rowling',
        summary: 'Harry a 2nd year student at Hogwarts starts hearing mysterious voices in serpent’s tongue. When unusual tragedies start occurring, him and his friends search for answers.',
        link: 'https://www.barnesandnoble.com/w/harry-potter-and-the-chamber-of-secrets-j-k-rowling/1004338523?ean=9780439064866',    
    },
    {
        id: '2',
        type: 'news',
        image: '',
        title: 'Chuck E. Cheese wants to be the Costco of family fun',
        author: 'Savannah Sellers and Alexandra Byrne',
        summary: 'Chuck E. Cheese wants you to stop by as frequently as you pick up groceries, and it’s selling subscription plans to sweeten the pitch',
        link: 'https://www.nbcnews.com/business/consumer/chuck-e-cheese-wants-costco-family-fun-rcna195652',    
    },
    {
        id: '3',
        type: 'poem',
        title: 'The Raven',
        author:'Edgar Allan Poe',
        poem: 'Once upon a midnight dreary, While I pondered, weak and weary, Over many a quaint and curious Volume of forgotten lore— While I nodded, nearly napping, Suddenly there came a tapping, As of some one gently rapping, Rapping at my chamber door. "T is some visitor," I muttered,',    
    },
]
   
export default function Home() {
    const router = useRouter();
    const [state, setState] = useState({page: 0})
    const [level, setLevel]=useState(0)
    const [percent, setPercent]=useState(0)
    const [like, setLike] = useState('heart-outline')
    const [favorite, setFavorite] = useState('bookmark-outline')

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

    const Item = ({item} : {item: ItemProps}) => (
        <View style={styles.contentContainer}>
            {item.image && <Image source={{uri: item.image}} style={styles.image}/>}
            <View style={{padding: 10}}>
                <View style={styles.mediaTag}>
                    <Text style={{color: 'white'}}>{item.type}</Text>
                </View>
                <Text style={textStyles.heading2purple}>{item.title}</Text>
                <Text style={textStyles.subheading}>By: {item.author}</Text>
                {(item.type === 'poem') &&
                    <Text style={textStyles.subheading}>{item.poem}</Text>
                }
                {(item.type !== 'poem') &&
                    <View>
                        <Text style={textStyles.heading2purple}>Summary:</Text>
                        <Text style={textStyles.subheading}>{item.summary}</Text>
                    </View>
                }
                
            </View>
            <View style={styles.pageButtons}>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <TouchableOpacity style={styles.circleButton}
                        onPress={() => setLike((prevIcon) => (prevIcon === "heart-outline" ? "heart" : "heart-outline"))}>
                        <Ionicons name={like} size={35} color={'white'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleButton}
                        onPress={() => setFavorite((prevIcon) => (prevIcon === "bookmark-outline" ? "bookmark" : "bookmark-outline"))}>
                        <Ionicons name={favorite} size={30} color={'white'}/>
                    </TouchableOpacity>
                </View>
                <Buttons
                    title='Read More'
                    variant='purple'
                    onPress={() => router.push('/home')}
                />
            </View>
        </View>
    );


    return (
        // <LinearGradient
        // colors={['#4F3F7F','#615796','#646EA3']}
        // style={styles.container}>
        <View style={styles.container}>
            <SwitchSelector
                initial={0}
                onPress={(value : number) => setState({ page : value })}
                textColor={'white'}
                selectedColor={'#413F6F'}
                backgroundColor={'#736F96'}
                buttonColor={'#E3E2EA'}
                borderColor={'#736F96'}
                hasPadding
                valuePadding={3}
                style={{ width: 200, marginTop: 50, marginBottom: 15, }}
                options={[{label: "For You", value: 0},{label: "Explore", value: 1}]}
            />


            <FlatList
                data={testSubjects}
                renderItem={({item}) => <Item item={item} />}
                keyExtractor={item => item.id}
                pagingEnabled={true}
                showsVerticalScrollIndicator={false}
                horizontal={false}
            />

            <View style={styles.lvlContainer}>
                <Text>{percent}%</Text>
                <Text>LVL {level}</Text>
            </View>
        </View>
        //</LinearGradient>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#4F3F7F',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    alignItems: 'flex-start',
    textAlign: 'center',
    height: 610,
    width: 350,
    marginBottom: 20,
    position: 'relative',
  },
  lvlContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: 350,
    height: 50,
    marginVertical: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
  },
  image: {
    width: '100%',
    height: '25%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#413F6F',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtons: {
    position: 'absolute',
    bottom: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaTag: {
    width: 80,
    height: 30,
    backgroundColor: "#736F96",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
});

