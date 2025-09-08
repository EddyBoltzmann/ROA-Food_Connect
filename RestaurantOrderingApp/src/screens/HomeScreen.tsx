import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import { fetchRestaurants, setSearchQuery } from '@store/slices/restaurantSlice';
import { Card, Rating, RestaurantCardSkeleton, GlassmorphismCard } from '@components';
import { lightTheme } from '@utils/theme';
import { Restaurant } from '@types/index';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { restaurants, isLoading, searchQuery } = useSelector((state: RootState) => state.restaurant);
  const { user } = useSelector((state: RootState) => state.auth);
  const { itemCount } = useSelector((state: RootState) => state.cart);

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleSearch = (text: string) => {
    setLocalSearchQuery(text);
    dispatch(setSearchQuery(text));
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurantId: restaurant.id });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleQRScanPress = () => {
    navigation.navigate('QRScan');
  };

  const handleGlassmorphismDemo = () => {
    navigation.navigate('GlassmorphismDemo');
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredRestaurants = restaurants.slice(0, 3);

  const renderRestaurantCard = ({ item }: { item: Restaurant }) => (
    <Card
      style={styles.restaurantCard}
      onPress={() => handleRestaurantPress(item)}
      theme={lightTheme}
    >
      <Image source={{ uri: item.image }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.restaurantCuisine}>{item.cuisine.join(' • ')}</Text>
        <View style={styles.restaurantDetails}>
          <Rating
            rating={item.rating}
            showText
            showCount
            reviewCount={item.reviewCount}
            size="small"
            theme={lightTheme}
          />
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
        </View>
        <View style={styles.restaurantFooter}>
          <Text style={styles.deliveryFee}>${item.deliveryFee.toFixed(2)} delivery</Text>
          <Text style={styles.minimumOrder}>Min ${item.minimumOrder.toFixed(2)}</Text>
        </View>
      </View>
    </Card>
  );

  const renderFeaturedCard = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => handleRestaurantPress(item)}
    >
      <Image source={{ uri: item.coverImage }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredName}>{item.name}</Text>
        <Text style={styles.featuredCuisine}>{item.cuisine.join(' • ')}</Text>
        <Rating
          rating={item.rating}
          showText
          size="small"
          theme={lightTheme}
        />
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <RestaurantCardSkeleton key={item} theme={lightTheme} />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Glassmorphism */}
      <LinearGradient
        colors={['#2ECC71', '#27AE60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
            <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.qrButton} onPress={handleQRScanPress}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassmorphismButton}
              >
                <Text style={styles.qrButtonText}>📱</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassmorphismButton}
              >
                <Text style={styles.cartButtonText}>🛒</Text>
                {itemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{itemCount}</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar with Glassmorphism */}
        <View style={styles.searchContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.searchGradient}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search restaurants, cuisines..."
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={localSearchQuery}
              onChangeText={handleSearch}
            />
            <Text style={styles.searchIcon}>🔍</Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Featured Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          <FlatList
            data={featuredRestaurants}
            renderItem={renderFeaturedCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Quick Actions with Glassmorphism */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <GlassmorphismCard theme={lightTheme} style={styles.quickActionCard}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>🍕</Text>
                <Text style={styles.quickActionText}>Pizza</Text>
              </TouchableOpacity>
            </GlassmorphismCard>
            <GlassmorphismCard theme={lightTheme} style={styles.quickActionCard}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>🍔</Text>
                <Text style={styles.quickActionText}>Burgers</Text>
              </TouchableOpacity>
            </GlassmorphismCard>
            <GlassmorphismCard theme={lightTheme} style={styles.quickActionCard}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>🍜</Text>
                <Text style={styles.quickActionText}>Asian</Text>
              </TouchableOpacity>
            </GlassmorphismCard>
            <GlassmorphismCard theme={lightTheme} style={styles.quickActionCard}>
              <TouchableOpacity style={styles.quickAction}>
                <Text style={styles.quickActionIcon}>🥗</Text>
                <Text style={styles.quickActionText}>Healthy</Text>
              </TouchableOpacity>
            </GlassmorphismCard>
          </View>
        </View>

        {/* Demo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UI Demo</Text>
          <GlassmorphismCard theme={lightTheme} style={styles.demoCard}>
            <TouchableOpacity onPress={handleGlassmorphismDemo} style={styles.demoButton}>
              <Text style={styles.demoTitle}>✨ Glassmorphism Demo</Text>
              <Text style={styles.demoDescription}>
                Explore modern glass effects and gradients
              </Text>
            </TouchableOpacity>
          </GlassmorphismCard>
        </View>

        {/* Nearby Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Restaurants</Text>
          {isLoading ? (
            renderSkeleton()
          ) : (
            <FlatList
              data={filteredRestaurants}
              renderItem={renderRestaurantCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.restaurantList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
  },
  qrButtonText: {
    fontSize: 20,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  glassmorphismButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  cartButtonText: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: lightTheme.colors.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  searchContainer: {
    borderRadius: lightTheme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: '#FFFFFF',
  },
  searchIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: width * 0.7,
    height: 200,
    marginRight: 16,
    borderRadius: lightTheme.borderRadius.lg,
    overflow: 'hidden',
    ...lightTheme.shadows.md,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  featuredName: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredCuisine: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  quickActionCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
  },
  restaurantList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 120,
  },
  restaurantInfo: {
    padding: 16,
  },
  restaurantName: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginBottom: 8,
  },
  restaurantDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.textSecondary,
  },
  restaurantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryFee: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
  },
  minimumOrder: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
  },
  skeletonContainer: {
    paddingHorizontal: 20,
  },
  demoCard: {
    marginBottom: 16,
  },
  demoButton: {
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  demoDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
});

export default HomeScreen;