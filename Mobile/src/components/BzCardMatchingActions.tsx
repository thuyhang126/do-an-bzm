import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

interface cardMatchingProps {
  onViewMorePress: () => void;
  onLikePress: () => void;
  onDislikePress: () => void;
}

const BzCardMatchingActions = ({
  onViewMorePress,
  onLikePress,
  onDislikePress,
}: cardMatchingProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonViewWrap}>
        <TouchableWithoutFeedback onPress={onViewMorePress}>
          <View style={styles.buttonViewContent}>
            <Text style={styles.buttonText}>+ Xem thêm profile</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.interactionWrap}>
        <View style={styles.buttonWrap}>
          <TouchableWithoutFeedback onPress={onDislikePress}>
            <View style={styles.buttonInteractionContent}>
              <Text style={styles.buttonText}>Không quan tâm</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.buttonWrap}>
          <TouchableWithoutFeedback onPress={onLikePress}>
            <View style={styles.buttonInteractionContent}>
              <Text style={styles.buttonText}>Quan tâm</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  buttonViewWrap: {
    marginBottom: 10,
  },
  buttonViewContent: {
    padding: 20,
  },
  interactionWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0000001A',
  },
  buttonWrap: {
    width: '49.85%',
    backgroundColor: '#FFFFFF',
  },
  buttonInteractionContent: {
    paddingVertical: 25,
  },
  buttonText: {
    textAlign: 'center',
  },
});

export default React.memo(BzCardMatchingActions);
