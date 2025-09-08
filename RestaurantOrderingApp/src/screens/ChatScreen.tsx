import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { 
  GlassmorphismCard,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';
import { RootStackParamList } from '@types/index';
import io from 'socket.io-client';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  isFromUser: boolean;
}

const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { restaurantId } = route.params;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [restaurantName, setRestaurantName] = useState('Restaurant');
  
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    initializeChat();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initializeChat = async () => {
    try {
      // Load restaurant details
      const restaurantResponse = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}`);
      const restaurantResult = await restaurantResponse.json();
      if (restaurantResult.success) {
        setRestaurantName(restaurantResult.data.name);
      }

      // Load chat history
      const messagesResponse = await fetch(`http://localhost:5000/api/chat/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      const messagesResult = await messagesResponse.json();
      if (messagesResult.success) {
        setMessages(messagesResult.data);
      }

      // Initialize socket connection
      socketRef.current = io('http://localhost:5000', {
        auth: {
          token: user?.token,
        },
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        socketRef.current.emit('join_restaurant_chat', restaurantId);
      });

      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
      });

      socketRef.current.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
        // Auto-scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      });

      socketRef.current.on('error', (error: any) => {
        console.error('Socket error:', error);
        Alert.alert('Connection Error', 'Failed to connect to chat server');
      });

    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Failed to load chat');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socketRef.current || !isConnected) {
      return;
    }

    const messageData = {
      restaurantId,
      message: newMessage.trim(),
    };

    try {
      socketRef.current.emit('send_message', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isFromUser ? styles.userMessage : styles.restaurantMessage
    ]}>
      <GlassmorphismCard theme={lightTheme} style={[
        styles.messageBubble,
        item.isFromUser ? styles.userBubble : styles.restaurantBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isFromUser ? styles.userMessageText : styles.restaurantMessageText
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.messageTime,
          item.isFromUser ? styles.userMessageTime : styles.restaurantMessageTime
        ]}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </GlassmorphismCard>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#2ECC71', '#27AE60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Chat with {restaurantName}</Text>
        <View style={styles.connectionStatus}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isConnected ? '#2ECC71' : '#E74C3C' }
          ]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </LinearGradient>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <GlassmorphismCard theme={lightTheme} style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newMessage.trim() || !isConnected) && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </GlassmorphismCard>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  restaurantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
  },
  userBubble: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
  },
  restaurantBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    lineHeight: 20,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  restaurantMessageText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: lightTheme.typography.fontSize.xs,
    fontFamily: lightTheme.typography.fontFamily.regular,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  restaurantMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: lightTheme.colors.border,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
  },
  textInput: {
    flex: 1,
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: '#FFFFFF',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: lightTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: lightTheme.borderRadius.md,
  },
  sendButtonDisabled: {
    backgroundColor: lightTheme.colors.textSecondary,
  },
  sendButtonText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: '#FFFFFF',
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

export default ChatScreen;