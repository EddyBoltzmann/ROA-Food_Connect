import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { 
  Card, 
  Button, 
  GlassmorphismCard,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';

interface LoyaltyReward {
  _id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discount: number;
  type: 'discount' | 'free_item' | 'cashback';
  isActive: boolean;
}

interface LoyaltyTransaction {
  _id: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  createdAt: Date;
  orderId?: string;
}

const LoyaltyScreen: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    setIsLoading(true);
    try {
      const [pointsResponse, rewardsResponse, transactionsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/loyalty/points', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        }),
        fetch('http://localhost:5000/api/loyalty/rewards', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        }),
        fetch('http://localhost:5000/api/loyalty/transactions', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        }),
      ]);

      const [pointsResult, rewardsResult, transactionsResult] = await Promise.all([
        pointsResponse.json(),
        rewardsResponse.json(),
        transactionsResponse.json(),
      ]);

      if (pointsResult.success) {
        setLoyaltyPoints(pointsResult.data.points);
      }

      if (rewardsResult.success) {
        setRewards(rewardsResult.data);
      }

      if (transactionsResult.success) {
        setTransactions(transactionsResult.data);
      }
    } catch (error) {
      console.error('Error loading loyalty data:', error);
      Alert.alert('Error', 'Failed to load loyalty data');
    } finally {
      setIsLoading(false);
    }
  };

  const redeemReward = async (reward: LoyaltyReward) => {
    if (loyaltyPoints < reward.pointsRequired) {
      Alert.alert('Insufficient Points', `You need ${reward.pointsRequired} points to redeem this reward.`);
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Are you sure you want to redeem "${reward.name}" for ${reward.pointsRequired} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Redeem',
          onPress: async () => {
            try {
              const response = await fetch('http://localhost:5000/api/loyalty/redeem', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({ rewardId: reward._id }),
              });

              const result = await response.json();

              if (result.success) {
                Alert.alert('Success', 'Reward redeemed successfully!');
                loadLoyaltyData();
              } else {
                Alert.alert('Error', result.message || 'Failed to redeem reward');
              }
            } catch (error) {
              console.error('Error redeeming reward:', error);
              Alert.alert('Error', 'Failed to redeem reward');
            }
          },
        },
      ]
    );
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount':
        return '💰';
      case 'free_item':
        return '🎁';
      case 'cashback':
        return '💳';
      default:
        return '🎁';
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'earned' ? '➕' : '➖';
  };

  const getTransactionColor = (type: string) => {
    return type === 'earned' ? lightTheme.colors.successGreen : lightTheme.colors.primary;
  };

  const renderReward = ({ item }: { item: LoyaltyReward }) => (
    <Card theme={lightTheme} style={styles.rewardCard}>
      <View style={styles.rewardHeader}>
        <Text style={styles.rewardIcon}>{getRewardIcon(item.type)}</Text>
        <View style={styles.rewardInfo}>
          <Text style={styles.rewardName}>{item.name}</Text>
          <Text style={styles.rewardDescription}>{item.description}</Text>
        </View>
        <Text style={styles.rewardPoints}>{item.pointsRequired} pts</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.redeemButton,
          loyaltyPoints < item.pointsRequired && styles.redeemButtonDisabled
        ]}
        onPress={() => redeemReward(item)}
        disabled={loyaltyPoints < item.pointsRequired}
      >
        <Text style={[
          styles.redeemButtonText,
          loyaltyPoints < item.pointsRequired && styles.redeemButtonTextDisabled
        ]}>
          {loyaltyPoints < item.pointsRequired ? 'Not Enough Points' : 'Redeem'}
        </Text>
      </TouchableOpacity>
    </Card>
  );

  const renderTransaction = ({ item }: { item: LoyaltyTransaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionIcon}>{getTransactionIcon(item.type)}</Text>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[
        styles.transactionPoints,
        { color: getTransactionColor(item.type) }
      ]}>
        {item.type === 'earned' ? '+' : '-'}{item.points}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading loyalty data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2ECC71', '#27AE60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Loyalty Rewards</Text>
        <Text style={styles.headerSubtitle}>Earn points with every order!</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Points Summary */}
        <GlassmorphismCard theme={lightTheme} style={styles.pointsCard}>
          <Text style={styles.pointsTitle}>Your Points</Text>
          <Text style={styles.pointsValue}>{loyaltyPoints}</Text>
          <Text style={styles.pointsSubtitle}>
            Keep ordering to earn more points and unlock amazing rewards!
          </Text>
        </GlassmorphismCard>

        {/* Available Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          <FlatList
            data={rewards}
            keyExtractor={(item) => item._id}
            renderItem={renderReward}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card theme={lightTheme} style={styles.transactionsCard}>
            {transactions.length > 0 ? (
              <FlatList
                data={transactions.slice(0, 5)}
                keyExtractor={(item) => item._id}
                renderItem={renderTransaction}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyTransactions}>
                <Text style={styles.emptyTransactionsText}>
                  No transactions yet. Start ordering to earn points!
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it Works</Text>
          <Card theme={lightTheme} style={styles.howItWorksCard}>
            <View style={styles.howItWorksItem}>
              <Text style={styles.howItWorksIcon}>🍽️</Text>
              <View style={styles.howItWorksInfo}>
                <Text style={styles.howItWorksTitle}>Order Food</Text>
                <Text style={styles.howItWorksDescription}>
                  Place orders through Food Connect
                </Text>
              </View>
            </View>
            <View style={styles.howItWorksItem}>
              <Text style={styles.howItWorksIcon}>⭐</Text>
              <View style={styles.howItWorksInfo}>
                <Text style={styles.howItWorksTitle}>Earn Points</Text>
                <Text style={styles.howItWorksDescription}>
                  Get 1 point for every ₵1 spent
                </Text>
              </View>
            </View>
            <View style={styles.howItWorksItem}>
              <Text style={styles.howItWorksIcon}>🎁</Text>
              <View style={styles.howItWorksInfo}>
                <Text style={styles.howItWorksTitle}>Redeem Rewards</Text>
                <Text style={styles.howItWorksDescription}>
                  Use points for discounts and free items
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  pointsCard: {
    margin: 20,
    padding: 24,
    alignItems: 'center',
  },
  pointsTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  pointsSubtitle: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 16,
  },
  rewardCard: {
    marginBottom: 16,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardName: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    lineHeight: 16,
  },
  rewardPoints: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.primary,
  },
  redeemButton: {
    backgroundColor: lightTheme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: lightTheme.borderRadius.md,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    backgroundColor: lightTheme.colors.textSecondary,
  },
  redeemButtonText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: '#FFFFFF',
  },
  redeemButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  transactionsCard: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  transactionIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
  },
  transactionPoints: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.bold,
  },
  emptyTransactions: {
    padding: 20,
    alignItems: 'center',
  },
  emptyTransactionsText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },
  howItWorksCard: {
    padding: 16,
  },
  howItWorksItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  howItWorksIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  howItWorksInfo: {
    flex: 1,
  },
  howItWorksTitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 4,
  },
  howItWorksDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    lineHeight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
  },
  loadingText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginTop: 16,
  },
});

export default LoyaltyScreen;