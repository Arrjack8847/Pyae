import { motion } from 'framer-motion'
import { ArrowRight, Heart } from 'lucide-react'

type LoveLetterProps = {
  onNext: () => void
}

const lines = [
  'အခုကစ နောက်နှစ်တွေများကြီးလည်းအတူတူတစ်ယောက်ကိုတစ်ယောက် ယုံယုံကြည့်ကြည်နဲ့လက်တွဲမဖြုတ်ဘဲဆက်ချစ်သွားကြမယ်နော်💗✨ကိုကိုဆိုးသမျှတွေလည်းသည်းခံပြီးအလိုလိုက်ပေးတဲ့အတွက်လည်းကျေးဇူးတင်ပါတယ်အချစ်ကလေးရယ် အများကြီးချစ်တယ်နော် အာဘွား🤭',
]

export function LoveLetter({ onNext }: LoveLetterProps) {
  return (
    <div className="letter-page light-blue-theme">
      <motion.div
        className="letter-card glass-panel"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <Heart className="letter-heart" size={31} fill="currentColor" aria-hidden="true" />
        <h1>Happy 5monthsary ပါကလေးလေးရေ</h1>

        <div className="letter-lines">
          {lines.map((line, index) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.78, duration: 0.42 }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.button
          type="button"
          className="primary-button letter-button"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.45, duration: 0.42 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
        >
          Open your final tiny surprise
          <ArrowRight size={18} aria-hidden="true" />
        </motion.button>
      </motion.div>
    </div>
  )
}
