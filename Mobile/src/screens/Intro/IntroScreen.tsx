import React, {ReactNode} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import BzButton from '../../components/BzButton';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';

interface BzStepSectionProps {
  title: string;
  child: () => ReactNode;
}

const IntroScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const BzStepSection = ({title, child}: BzStepSectionProps) => {
    return (
      <View style={styles.stepWrapper}>
        <View style={styles.stepTitle}>
          <Text style={styles.stepTitleText}>{title}</Text>
        </View>
        <View style={styles.stepContent}>{child()}</View>
      </View>
    );
  };

  return (
    <>
      <BzCustomHeader />
      <View style={styles.wrapper}>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 15}}>
          <Text style={styles.heading}>
            Chào mừng bạn đến với{'\n'}
            <Text style={styles.brandName}>Business Matching!</Text>
          </Text>

          <View style={styles.steps}>
            <BzStepSection
              title="Step 1:"
              child={() => {
                return (
                  <View>
                    <Text style={styles.stepContentText}>
                      {'\u2022'} Tạo tài khoản.
                    </Text>
                    <Text style={styles.stepContentText}>
                      {'\u2022'} Điền nội dung giới thiệu mô hình kinh doanh của
                      bạn.
                    </Text>
                  </View>
                );
              }}
            />

            <BzStepSection
              title="Step 2:"
              child={() => {
                return (
                  <View>
                    <Text style={styles.stepContentText}>
                      Chờ hệ thống xác thực thông tin trong ngày làm việc tiếp
                      theo.
                    </Text>
                  </View>
                );
              }}
            />

            <BzStepSection
              title="Step 3:"
              child={() => {
                return (
                  <View>
                    <Text style={styles.stepContentText}>
                      Quay lại bổ sung nội dung, và sử dụng app.
                    </Text>
                  </View>
                );
              }}
            />
          </View>

          <View style={{alignItems: 'center'}}>
            <BzButton
              title="Tiếp tục"
              onPress={() => {
                navigation.push('LOGIN');
              }}
            />
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  heading: {
    fontSize: 28,
    lineHeight: 35,
    color: '#87D1D1',
    textAlign: 'center',
    marginBottom: 50,
  },
  brandName: {
    fontWeight: '700',
  },
  steps: {},
  stepWrapper: {
    borderRadius: 10,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 3,
  },
  stepContent: {
    position: 'relative',
    padding: 15,
    paddingTop: 25,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  stepTitle: {
    width: 120,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C0E087',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: '50%',
    zIndex: 9,
    transform: [{translateX: -60}, {translateY: -17}],
  },
  stepTitleText: {
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#FFFFFF',
  },
  stepContentText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#3E3E3E',
  },
});

export default IntroScreen;
