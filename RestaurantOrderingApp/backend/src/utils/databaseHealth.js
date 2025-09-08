const mongoose = require('mongoose');

/**
 * Database Health Check Utility
 * Provides methods to check MongoDB Atlas connection and database health
 */

class DatabaseHealth {
  constructor() {
    this.connection = mongoose.connection;
  }

  /**
   * Check if database is connected
   */
  isConnected() {
    return this.connection.readyState === 1;
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[this.connection.readyState] || 'unknown';
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats() {
    try {
      if (!this.isConnected()) {
        throw new Error('Database not connected');
      }

      const db = this.connection.db;
      const stats = await db.stats();
      
      return {
        database: db.databaseName,
        host: this.connection.host,
        port: this.connection.port,
        collections: stats.collections,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
        indexes: stats.indexes,
        objects: stats.objects,
        avgObjSize: stats.avgObjSize,
        fileSize: stats.fileSize,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  }

  /**
   * Get collection statistics
   */
  async getCollectionStats() {
    try {
      if (!this.isConnected()) {
        throw new Error('Database not connected');
      }

      const db = this.connection.db;
      const collections = await db.listCollections().toArray();
      
      const collectionStats = await Promise.all(
        collections.map(async (collection) => {
          try {
            const stats = await db.collection(collection.name).stats();
            return {
              name: collection.name,
              count: stats.count,
              size: stats.size,
              avgObjSize: stats.avgObjSize,
              storageSize: stats.storageSize,
              totalIndexSize: stats.totalIndexSize,
              indexes: stats.nindexes,
            };
          } catch (error) {
            return {
              name: collection.name,
              error: error.message,
            };
          }
        })
      );

      return collectionStats;
    } catch (error) {
      throw new Error(`Failed to get collection stats: ${error.message}`);
    }
  }

  /**
   * Test database operations
   */
  async testDatabaseOperations() {
    try {
      if (!this.isConnected()) {
        throw new Error('Database not connected');
      }

      const testResults = {
        connection: true,
        read: false,
        write: false,
        index: false,
      };

      // Test read operation
      try {
        const User = mongoose.model('User');
        await User.findOne().limit(1);
        testResults.read = true;
      } catch (error) {
        console.log('Read test failed:', error.message);
      }

      // Test write operation (create a test document)
      try {
        const db = this.connection.db;
        const testCollection = db.collection('health_check');
        await testCollection.insertOne({
          test: true,
          timestamp: new Date(),
        });
        testResults.write = true;

        // Clean up test document
        await testCollection.deleteOne({ test: true });
      } catch (error) {
        console.log('Write test failed:', error.message);
      }

      // Test index operation
      try {
        const db = this.connection.db;
        const testCollection = db.collection('health_check');
        await testCollection.createIndex({ timestamp: 1 });
        testResults.index = true;

        // Clean up test index
        await testCollection.dropIndex({ timestamp: 1 });
      } catch (error) {
        console.log('Index test failed:', error.message);
      }

      return testResults;
    } catch (error) {
      throw new Error(`Failed to test database operations: ${error.message}`);
    }
  }

  /**
   * Get comprehensive health report
   */
  async getHealthReport() {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        connection: {
          status: this.getConnectionStatus(),
          connected: this.isConnected(),
          host: this.connection.host,
          port: this.connection.port,
          database: this.connection.name,
        },
        operations: await this.testDatabaseOperations(),
        collections: await this.getCollectionStats(),
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          version: process.version,
          platform: process.platform,
        },
      };

      // Determine overall health status
      if (!report.connection.connected) {
        report.status = 'unhealthy';
      } else if (!report.operations.read || !report.operations.write) {
        report.status = 'degraded';
      }

      return report;
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        status: 'unhealthy',
        error: error.message,
        connection: {
          status: this.getConnectionStatus(),
          connected: this.isConnected(),
        },
      };
    }
  }

  /**
   * Monitor database connection
   */
  startMonitoring() {
    this.connection.on('connected', () => {
      console.log('🔗 Database connected');
    });

    this.connection.on('error', (error) => {
      console.error('❌ Database connection error:', error);
    });

    this.connection.on('disconnected', () => {
      console.log('🔌 Database disconnected');
    });

    this.connection.on('reconnected', () => {
      console.log('🔄 Database reconnected');
    });
  }
}

module.exports = DatabaseHealth;