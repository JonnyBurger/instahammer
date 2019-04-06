import React from 'react'
import { shuffle } from 'lodash'
import { LeftToRightReveal } from './LeftToRightReveal'
import { FadingAvatar } from './FadingAvatar'

export class Experts extends React.Component {
  render() {
    const howManyExperts = Math.floor(this.props.term.length % 6) + 3
    const guys = shuffle([
      require('../assets/guy1.jpg'),
      require('../assets/guy2.jpg'),
      require('../assets/guy3.jpg'),
    ])
    return (
      <>
        <LeftToRightReveal
          style={{
            fontSize: 16,
            fontFamily: 'frutiger-bold',
            color: 'rgba(0, 0, 0, 0.4)',
          }}
          height={30}
          key={this.props.term + 'experts'}
        >
          {howManyExperts} experts may help{' '}
        </LeftToRightReveal>
        <FadingAvatar left={135} top={24} source={guys[0]} />
        <FadingAvatar left={145} top={24} source={guys[1]} />
        <FadingAvatar left={155} top={24} source={guys[2]} />
      </>
    )
  }
}
