// src/screens/customer/CelebrityList.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import Colors from '../../constants/Colors';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const sampleCelebs = [
    {
        id: '1',
        displayName: 'DJ Zinhle',
        category: 'Musician',
        price: 25,
        deliveryTime: '2 days',
        rating: 4.8,
        shoutoutsCount: 142,
        picture: 'https://randomuser.me/api/portraits/men/70.jpg',
        bio: 'Top DJ and businesswoman ready to hype you up!',
    },
    {
        id: '2',
        displayName: 'Cassper Nyovest',
        category: 'Musician',
        price: 40,
        deliveryTime: '1 day',
        rating: 4.6,
        shoutoutsCount: 220,
        picture: 'https://randomuser.me/api/portraits/men/54.jpg',
        bio: 'South African rap legend. Bringing the hype to your screen!',
    },
    {
        id: '3',
        displayName: 'Sho Madjozi',
        category: 'Actor',
        price: 30,
        deliveryTime: '3 days',
        rating: 4.9,
        shoutoutsCount: 190,
        picture: 'https://randomuser.me/api/portraits/women/30.jpg',
        bio: 'Colorful, creative, and full of joy! Let’s celebrate together!',
    },
    {
        id: '4',
        displayName: 'Black Coffee',
        category: 'Musician',
        price: 50,
        deliveryTime: '2 days',
        rating: 4.7,
        shoutoutsCount: 165,
        picture: 'https://randomuser.me/api/portraits/men/63.jpg',
        bio: 'Global DJ with a touch of class. Shoutouts with style.',
    },
];

export default function CelebrityList({ navigation, route }) {
    const { category } = route.params || {};
    const [search, setSearch] = useState('');
    const [celebs, setCelebs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCelebs = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await api.get('celebs/list-celebs', {
                    headers: { 'X-Authorization': token },
                });
                if (res.data.success) {
                    setCelebs(res.data.data || []);
                } else {
                    console.warn('⚠️ Failed to fetch celebs:', res.data.message);
                }
            } catch (err) {
                console.error('❌ Error fetching celebs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCelebs();
    }, []);

    const filteredCelebs = sampleCelebs.filter((celeb) => {
        const matchesSearch = celeb.displayName
            ?.toLowerCase()
            .includes(search.toLowerCase());
        // const matchesCategory = category ? celeb.category === category : true;
        // return matchesSearch && matchesCategory;
        return matchesSearch;
    });

    const renderCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('CelebrityProfile', { celeb: item })}
        >
            <Image
                source={{
                    uri: item.picture
                        ? item.picture
                        : 'https://via.placeholder.com/150?text=No+Image',
                }}
                style={styles.avatar}
            />
            <View style={styles.cardInfo}>
                <Text style={styles.name}>
                    {item.displayName || 'Unnamed Celebrity'}
                </Text>
                <Text style={styles.price}>
                    ${item.shoutout?.[0]?.price || '0'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <Image
                source={require('../../../assets/images/abstract_bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
            >
                <Icon name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>

            <Text style={styles.header}>
                {category ? `${category} Celebrities` : 'All Celebrities'}
            </Text>

            <TextInput
                style={styles.searchBar}
                placeholder="Search Stars..."
                placeholderTextColor="#aaa"
                value={search}
                onChangeText={setSearch}
            />

            <FlatList
                data={filteredCelebs}
                keyExtractor={(item) => item._id}
                renderItem={renderCard}
                numColumns={2}
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center', // center vertically
        alignItems: 'center',     // center horizontally
        padding: 24,
        paddingTop: 60,
        paddingHorizontal: 16,
        backgroundColor: Colors.secondary,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.08,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 16,
    },
    searchBar: {
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        marginBottom: 20,
        width: '100%',
        color: '#333',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        backgroundColor: Colors.bubbleBg,
        borderRadius: 16,
        overflow: 'hidden',
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    avatar: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    cardInfo: {
        padding: 8,
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginBottom: 4,
        textAlign: 'center',
    },
    price: {
        fontSize: 12,
        color: Colors.accentGreen,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
