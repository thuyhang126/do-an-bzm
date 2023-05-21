import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';

import {IMAGE} from '../../constants';
import BzButton from '../../components/BzButton';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';

const CardProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const router = useRoute<any>();
  let userCard = router.params?.user;
  if (userCard.attr) {
    userCard = {...userCard, ...userCard.attr};
    delete userCard.attr;
  }

  const businessModel = JSON.parse(userCard.business_model).filter(
    (item: any) => item.isChecked,
  );
  const purpose = JSON.parse(userCard.purpose).filter(
    (item: any) => item.isChecked,
  );

  return (
    <>
      <BzCustomHeader title="Profile" showRightButton />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Image source={{uri: userCard.avatar}} style={styles.avatarImage} />
          </View>

          <View style={styles.profile}>
            <Text style={styles.name}>{userCard.name}</Text>
            <Text style={styles.companyName}>{userCard.company}</Text>
            {!userCard.public && (
              <Text style={styles.position}>{userCard.position}</Text>
            )}
            {userCard.public && (
              <Text style={styles.position}>
                {userCard.position} -{' '}
                {moment(userCard.birthday).format('DD/MM/YYYY')}
              </Text>
            )}

            <View style={styles.interaction}>
              <View style={styles.interactionBox}>
                <Text style={styles.interactionText}>Like</Text>
                <Text style={[styles.interactionText, styles.interactionCount]}>
                  {userCard.like | 0}
                </Text>
              </View>
              <View style={styles.interactionBox}>
                <Text style={styles.interactionText}>Được Like</Text>
                <Text style={[styles.interactionText, styles.interactionCount]}>
                  {userCard.received_like | 0}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.summary}>
          <View style={[styles.summaryBlock, styles.businessModel]}>
            <Text style={styles.blockTitle}>Lĩnh vực kinh doanh</Text>
            {businessModel.map((item: any, index: number) => {
              return (
                <Text key={index} style={styles.blockText}>
                  ・{item.label}
                </Text>
              );
            })}
          </View>

          <View style={[styles.summaryBlock, styles.purpose]}>
            <Text style={styles.blockTitle}>Mục đích sử dụng</Text>
            {purpose.map((item: any, index: number) => {
              return (
                <Text key={index} style={styles.blockText}>
                  ・{item.label}
                </Text>
              );
            })}
          </View>

          <View style={[styles.summaryBlock, styles.description]}>
            <Text style={styles.blockTitle}>Mô tả thêm</Text>
            <Text style={styles.blockText}>{userCard.descriptions}</Text>
          </View>

          <View style={[styles.summaryBlock, styles.cardVisit]}>
            <Text style={styles.blockTitle}>Danh thiếp</Text>
            <View style={styles.cardVisitWrap}>
              <Image
                source={
                  userCard.card_visit
                    ? {uri: userCard.card_visit}
                    : IMAGE.CARD_VISIT
                }
                style={styles.cardVisitImage}
              />
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <BzButton
              title="Trở về"
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  userCard: {
    marginTop: 60,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F4F4F4',
    borderRadius: 10,
    shadowColor: '#0000001A',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 3,
  },
  profile: {
    borderRadius: 10,
    paddingTop: 75,
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatar: {
    width: 120,
    position: 'absolute',
    top: -60,
    zIndex: 9,
  },
  avatarImage: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  companyName: {
    fontSize: 15,
    color: '#3E3E3E',
    textAlign: 'center',
  },
  position: {
    fontSize: 15,
    color: '#3E3E3E',
    textAlign: 'center',
    marginBottom: 20,
  },
  interaction: {
    flexDirection: 'row',
    borderColor: '#F4F4F4',
    borderTopWidth: 1,
    paddingVertical: 15,
  },
  interactionBox: {
    width: '50%',
  },
  interactionText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#3E3E3E',
  },
  interactionCount: {
    fontSize: 30,
    fontWeight: '700',
    color: '#87D1D1',
  },
  summary: {},
  summaryBlock: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  businessModel: {},
  purpose: {},
  description: {},
  blockTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    color: '#3E3E3E',
    marginBottom: 10,
  },
  blockText: {
    fontSize: 15,
    color: '#707070',
  },
  cardVisit: {
    marginBottom: 30,
  },
  cardVisitWrap: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardVisitImage: {
    width: '100%',
    height: 'auto',
    aspectRatio: 92 / 56,
    borderRadius: 20,
  },
});

export default CardProfileScreen;
