import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CardStack, {Card} from 'react-native-card-stack-swiper';
import moment from 'moment';

import {API, APP} from '../../constants';
import {useBzFetch} from '../../hooks/useBzFetch';
import {
  setCards,
  setIsMatched,
  setMatchedTime,
} from '../../redux/cards/matchingSlice';
import BzBottomActions from '../../components/BzBottomActions';
import BzCardMatchingActions from '../../components/BzCardMatchingActions';
import BzNoMoreCards from '../../components/BzNoMoreCards';
import BzCustomHeader from '../../components/BzCustomHeader';
import {StackParamList} from '../../navigations/AppNavigation';
import {RootState} from '../../redux/store';

const CardSwiperScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const BzFetch = useBzFetch();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const cards = useSelector((state: RootState) => state.cards);
  const cardStackRef = useRef<CardStack | null>();
  const [isSwipedAll, setIsSwipedAll] = useState(false);

  useEffect(() => {
    const currentTime = moment().unix();
    if (
      moment
        .unix(cards.matchedTime)
        .add(APP.NEXT_MATCHING_HOURS, 'hours')
        .unix() <= currentTime
    ) {
      BzFetch.get(API.MATCHING_CARDS_DATA)
        .then(rs => {
          const {data} = rs.data;
          const availableCards = data.arrayUserMatches.filter((card: any) => {
            return !card.isMatched;
          });
          dispatch(
            setCards({
              data: availableCards,
            }),
          );
          dispatch(
            setMatchedTime({
              matchedTime: currentTime,
            }),
          );
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, []);

  const onLikeHandle = (userId: number) => {
    BzFetch.post(API.MATCHING_INTERACTION, {
      receiver_id: userId,
      action: 'liked',
    })
      .then(rs => console.log(rs.data))
      .catch(err => {
        console.log(err);
      });
  };
  const onDislikeHandle = () => {};
  const onInteractionHandle = (cardIndex: number, interaction: string) => {
    const userId = cards.data[cardIndex].id;

    switch (interaction) {
      case 'like':
        onLikeHandle(userId);
        break;
      case 'dislike':
        onDislikeHandle();
        break;
      default:
        console.log('INTERACTION UNKNOWN');
    }

    dispatch(
      setIsMatched({
        userId,
      }),
    );
  };

  return (
    <>
      <BzCustomHeader user={user} title="Matching" showRightButton />
      <View style={styles.wrapper}>
        <View style={{width: '100%', backgroundColor: '#F5F5F5'}}>
          <View style={{width: '25%', height: 3, backgroundColor: '#87D1D1'}} />
        </View>
        {/* @ts-ignore */}
        <CardStack
          style={styles.cardStack}
          cardContainerStyle={{width: '100%', height: '100%'}}
          verticalSwipe={false}
          ref={swiper => {
            cardStackRef.current = swiper;
          }}
          onSwipedLeft={(index: number) => {
            onInteractionHandle(index, 'dislike');
          }}
          onSwipedRight={(index: number) => {
            onInteractionHandle(index, 'like');
          }}
          onSwipedAll={() => {
            setIsSwipedAll(true);
          }}
          renderNoMoreCards={() => {
            return (
              <BzNoMoreCards isSwipedAll={isSwipedAll || !cards.data.length} />
            );
          }}>
          {cards.data.map((card: any, index: number) => {
            const businessModel = JSON.parse(card.business_model)
              .filter((item: any) => {
                return item.isChecked;
              })
              .map((item: any) => {
                return item.label;
              });

            return (
              // @ts-ignore
              <Card key={index} style={styles.card}>
                <View style={styles.profileWrap}>
                  <View style={styles.avatarWrap}>
                    <Image source={{uri: card.avatar}} style={styles.avatar} />
                  </View>

                  <View style={styles.profile}>
                    <Text style={styles.name}>{card.name}</Text>
                    <Text style={styles.companyName}>{card.company}</Text>
                    <Text style={styles.position}>{card.position}</Text>
                  </View>
                </View>

                <View style={styles.summary}>
                  <View style={[styles.summaryBlock, styles.businessModel]}>
                    <Text style={styles.blockTitle}>Lĩnh vực kinh doanh :</Text>
                    <Text style={styles.blockText}>
                      {businessModel.join(', ')}
                    </Text>
                  </View>

                  <View style={[styles.summaryBlock, styles.description]}>
                    <Text style={styles.blockTitle}>Mô tả :</Text>
                    <Text style={styles.blockText}>{card.descriptions}</Text>
                  </View>
                </View>

                <BzCardMatchingActions
                  onViewMorePress={() => {
                    navigation.push('CARD_PROFILE', {
                      user: card,
                    });
                  }}
                  onDislikePress={() => {
                    cardStackRef.current?.swipeLeft();
                  }}
                  onLikePress={() => {
                    cardStackRef.current?.swipeRight();
                  }}
                />
              </Card>
            );
          })}
        </CardStack>
        <BzBottomActions />
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
  cardStack: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  card: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  profileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 35,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  avatarWrap: {
    width: 80,
    height: 80,
  },
  avatar: {
    width: '100%',
    height: 'auto',
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 100,
  },
  profile: {
    paddingLeft: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  companyName: {
    fontSize: 18,
    color: '#3E3E3E',
  },
  position: {
    fontSize: 15,
    color: '#707070',
  },
  summary: {
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: '#F4F4F4',
  },
  summaryBlock: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  businessModel: {},
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
});

export default CardSwiperScreen;
