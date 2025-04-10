import { Text, View, FlatList, ScrollView, TextInput, StyleSheet, TouchableOpacity} from "react-native";
import { useState} from "react";
import { useRouter } from "expo-router";
import axios from 'axios'
import DropDownButtons from "../components/dropDownButtons";
import { textStyles } from "../stylesheets/textStyles";
import { LinearGradient } from "expo-linear-gradient";
import { ngrokPath, isExpoMode } from "../utils";

export default function Search() {
    const router = useRouter();
    interface SubjectItem {
        id: string;
        type: string;
        image?: string;
        title: string;
        author: string;
        link?: string;
        summary?: string;
        poem?: string;
    }
    const [searchItems, setSearchItems] = useState<SubjectItem[]>([]);
    const testSubjects: SubjectItem[] = [];

    const [searchQuery, setSearchQuery] = useState("");
    const handleSearch = async (query: string) => {
        try{
            testSubjects.splice(0, testSubjects.length);
            setSearchQuery(query);
            console.log(query);

            try{
                const response = await axios.post(`${isExpoMode == true ? ngrokPath : "http://localhost:8000"}/api/article/search`, {keyword: query});
                for(let i = 0; i < response.data.length; i++){
                    response.data[i].author = response.data[i].author.substr(3);
                    const transformedData = {
                    id: response.data[i]._id,
                    type: "article",
                    image: `https://static01.nyt.com/${response.data[i].urlToImage}` || "",
                    title: response.data[i].title,
                    author: response.data[i].author,
                    link: response.data[i].url,
                    summary: response.data[i].description,
                    }
                    if (!testSubjects.some(subject => subject.id === transformedData.id)) {
                    testSubjects.push(transformedData);
                    }
                    // console.log(response.data[i])
                }
            }catch(error){
                if (axios.isAxiosError(error)) {
                    if(error.response){
                        console.log('Error: ', error.response.data)
                    }
                }
            }
            try{
                const bookResponse = await axios.post(`${isExpoMode == true ? ngrokPath : "http://localhost:8000"}/api/book/search`, {keyword: query});
                for(let i = 0; i < bookResponse.data.length; i++){
                    if(bookResponse.data[i].author.length == 0){
                    bookResponse.data[i].author = bookResponse.data[i].publisher
                    }
                    else{
                    bookResponse.data[i].author = bookResponse.data[i].author[0]
                    }
                    const transformedData = {
                    id: bookResponse.data[i]._id,
                    type: "book",
                    image: bookResponse.data[i].thumbnail || "",
                    title: bookResponse.data[i].title,
                    author: bookResponse.data[i].author,
                    link: bookResponse.data[i].previewLink,
                    summary: bookResponse.data[i].description,
                    }
                    if (!testSubjects.some(subject => subject.id === transformedData.id)) {
                    testSubjects.push(transformedData);
                    }
                    // console.log(bookResponse.data[i])
                }
            }catch(error){
                if (axios.isAxiosError(error)) {
                    if(error.response){
                        console.log('Error: ', error.response.data)
                    }
                }
            }
            try{
                const newsResponse = await axios.post(`${isExpoMode == true ? ngrokPath : "http://localhost:8000"}/api/news/search`, {keyword: query});
                for(let i = 0; i < newsResponse.data.length; i++){
                    const transformedData = {
                    id: newsResponse.data[i]._id,
                    type: "news",
                    image: newsResponse.data[i].urlToImage || "",
                    title: newsResponse.data[i].title,
                    author: newsResponse.data[i].author,
                    link: newsResponse.data[i].url,
                    summary: newsResponse.data[i].description,
                    }
                    if (!testSubjects.some(subject => subject.id === transformedData.id)) {
                    testSubjects.push(transformedData);
                    }
                    // console.log(newsResponse.data[i])
                }
            }catch(error){
                if (axios.isAxiosError(error)) {
                    if(error.response){
                        console.log('Error: ', error.response.data)
                    }
                }
            }
            try{
                const poemResponse = await axios.post(`${isExpoMode == true ? ngrokPath : "http://localhost:8000"}/api/poem/search`, {keyword: query});
                for(let i = 0; i < poemResponse.data.length; i++){
                    let poem = "";
                    for(let j = 0; j < poemResponse.data[i].lines.length; j++){
                    poem = poem + poemResponse.data[i].lines[j] + "\n"
                    }
                    const transformedData = {
                    id: poemResponse.data[i]._id,
                    type: "poem",
                    title: poemResponse.data[i].title,
                    author: poemResponse.data[i].author,
                    poem: poem,
                    }
                    
                    if (!testSubjects.some(subject => subject.id === transformedData.id)) {
                    testSubjects.push(transformedData);
                    }
                    // console.log(poemResponse.data[i])
                }
            }catch(error){
                if (axios.isAxiosError(error)) {
                    if(error.response){
                        console.log('Error: ', error.response.data)
                    }
                }
            }
            try{
                const paperResponse = await axios.post(`${isExpoMode == true ? ngrokPath : "http://localhost:8000"}/api/paper/search`, {keyword: query});
                for(let i = 0; i < paperResponse.data.length; i++){
                    let author = "";
                    if(paperResponse.data[i].author[0] == "Unknown Author") author = "";
                    const transformedData = {
                    id: paperResponse.data[i]._id,
                    type: "paper",
                    title: paperResponse.data[i].title,
                    author: author,
                    summary: paperResponse.data[i].abstract,
                    link: paperResponse.data[i].url,
                    }
                    
                    if (!testSubjects.some(subject => subject.id === transformedData.id)) {
                    testSubjects.push(transformedData);
                    }
                    // console.log(paperResponse.data[i])
                }
            }catch(error){
                if (axios.isAxiosError(error)) {
                    if(error.response){
                        console.log('Error: ', error.response.data)
                    }
                }
            }
            setSearchItems(testSubjects)
        } catch(error){
            console.error('Error searching:', error);
        }
    }
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
        <View style={{width: '90%'}}>
            <Text numberOfLines={2} style={[textStyles.heading2purple,{fontSize: 16}]}>{item.title}</Text>
            {item.author && <Text numberOfLines={1} style={[textStyles.subheading, {fontSize: 14}]}>By: {item.author}</Text> }
        </View>
        <View>
            <TouchableOpacity onPress={() => (router.push({ pathname: "/readMore", params: { item: JSON.stringify(item) } }))}>
                <Text style={textStyles.heading2purple}> {`>`}</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.inputContainer}
                placeholder="Search"
                placeholderTextColor="#807A7A"
                clearButtonMode="always"
                value={searchQuery}
                onChangeText={(query) => handleSearch(query)}>
            </TextInput>
            
            { searchQuery.trim() !=="" ? (
                    <LinearGradient
                        colors={["#4F3F7F", "#615796", "#646EA3"]}
                        style={styles.flatlistContainer}
                    >
                        <FlatList
                            data={searchItems}
                            renderItem={({ item }) => <Item item={item} />}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={true}
                            horizontal={false}
                        />
                    </LinearGradient>
                ) : (
                    <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
                        <Text style={[textStyles.heading2purple,{marginVertical: 10,}]}>Categories</Text>
                        <DropDownButtons
                            title='Books'
                            variant='white'
                            categories={["Horror", "Romance", "Mystery"]}
                            gradientColors={['#5C3E8F', '#2D1A4E']} 
                        />
                        <DropDownButtons
                            title='News'
                            variant='white'
                            categories={[]}
                            gradientColors={['#615796', '#3B3461']} 
                        />
                        <DropDownButtons
                            title='Poems'
                            variant='white'
                            categories={[]}
                            gradientColors={['#514F82', '#22205F']} 
                        />
                        <DropDownButtons
                            title='Politics'
                            variant='white'
                            categories={[]}
                            gradientColors={['#3F497B', '#646EA3']} 
                        />
                        <DropDownButtons
                            title='Research'
                            variant='white'
                            categories={[]}
                            gradientColors={['#514F82', '#7347AD']} 
                        />
                        <Text style={[textStyles.heading2purple,{marginVertical: 10,}]}>Other</Text>
                        <DropDownButtons
                            title='Quiz'
                            variant='whiteOutline'
                            categories={["Go to today's quiz", "See past results"]}
                            gradientColors={['#103A70', '#485EEA']} 
                        />
                        <DropDownButtons
                            title='Favorites'
                            variant='whiteOutline'
                            categories={["See all favorites"]}
                            gradientColors={['#042C71', '#6D90EB']} 
                        />
                    </ScrollView>
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 80,
        marginHorizontal: 20,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5,
        borderColor: '#E9E9E9',
        elevation: 10,
        height: 50,
        width: '100%',
        fontSize: 20,
        color: "#A39F9F",
        paddingHorizontal: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    contentContainer: {
        width: 340,
        height: 100,
        marginVertical: 15,
        padding: 15,
        borderRadius: 5,
        backgroundColor: "white",
        shadowColor: "#000",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flatlistContainer: {
        backgroundColor: "#646EA3",
        marginVertical: 15,
        height: 630,
        borderRadius: 5,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
    },
    categoriesContainer: {
        width: '100%',
        
    },
});