## TABLE (F.Reg)
|NAME|AUROC|FPR|FNR|AUP|AUPR|
|-|-|-|-|-|-|
|softmax|0.9866|0.0584|0.0571|0.9968|0.9500|
|sigmoid|0.9818|0.0885|0.0747|0.9957|0.9246|
|tsig3322|0.9847|0.0628|0.0627|0.9962|0.9428|
|tsig3522|0.9871|0.0528|0.0533|0.9968|0.9540|
|marina3522|0.9884|0.0438|0.0459|0.9971|0.9598|
|aria3522|0.9885|0.0462|0.0482|0.9972|0.9606|

## TABLE (Logit)
|NAME|AUROC|FPR|FNR|AUP|AUPR|
|-|-|-|-|-|-|
|softmax|0.9824|0.0767|0.0739|0.9956|0.9351|
|sigmoid|0.9801|0.0915|0.0879|0.9945|0.9375|
|tsig3322|0.9826|0.0724|0.0678|0.9952|0.9418|
|tsig3522|0.9827|0.0738|0.0706|0.9952|0.9461|
|marina3522|0.9857|0.0514|0.0529|0.9961|0.9552|
|aria3522|0.9861|0.0531|0.0553|0.9963|0.9578|

## TABLE (Maha)
|NAME|AUROC|FPR|FNR|AUP|AUPR|
|-|-|-|-|-|-|
|softmax|0.9863|0.0568|0.0574|0.9965|0.9495|
|sigmoid|0.9811|0.0891|0.0760|0.9953|0.9205|
|tsig3322|0.9840|0.0655|0.0632|0.9960|0.9386|
|tsig3522|0.9862|0.0542|0.0537|0.9965|0.9496|
|marina3522|0.9876|0.0458|0.0471|0.9968|0.9556|
|aria3522|0.9879|0.0495|0.0498|0.9970|0.9571|

## 실험 결과의 기본 전제
- 모두 Roberta-large + CLINC + OOD(N.E.)의 결과입니다.
- Softmax가 ood데이터를 입력받는 경우 정답은 '1/{클래스 수}'이 되도록 학습했습니다.
- T-Sigmoid-(option)-p1-p2-q1-q2 순으로 이름이 지어졌습니다.
- 시드를 바꿔가면서 반복 횟수는 10회입니다.

## 모델의 종류
1. Softmax:
    - 일반 소프트맥스입니다.
2. Sigmoid:
    - 일반 시그모이드입니다.
3. T-Sigmoid-3-3-2-2:
    - OOD와 IND 사이에 갭이 없는 T-Sigmoid입니다.
4. T-Sigmoid-3-5-2-2:
    - 우리가 아는 그 T-Sigmoid입니다.
5. T-Sigmoid-Marina-3-5-2-2:
    - OOD와 IND사이에는 갭을 주고,
    - IND 클래스 끼리는 정상적으로 Softmax 처리를 한 T-Sigmoid입니다.
6. T-Sigmoid-Aria-3-5-2-2:
    - OOD와 IND사이에는 갭을 주고,
    - IND 클래스 끼리도 갭을 주면서 Softmax 처리를 한 T-Sigmoid입니다.
    - Hetero-Activation으로 발전하기 직전의 형태이며,
    - T-Sigmoid 라고 이름 짓기 애매해집니다.

## Marina Code
```python
probs11, probs12, probs, _, logits = self.inferTSigmoid(features)[:5]
loss1 = tf.losses.binary_crossentropy(
    reals, probs11 * (1 - knowns) + probs12 * reals)
# 위는 특별한 T-Sigmoid 처리입니다. 여기서 IND 클래스 사이의 관계는 무시합니다.
probs2 = tf.nn.softmax(logits) # 평범한 Softmax 처리입니다.
loss2 = tf.losses.binary_crossentropy(
    reals, probs2 * knowns) # Softmax 계산에서는 OOD는 무시합니다.
loss = loss1 + loss2
```

## Aria Code
```python
probs1, probs2, probs, logits1, logits2 = self.inferTSigmoid(features)[:5]
loss1 = tf.losses.binary_crossentropy(
    reals, probs1 * (1 - knowns) + probs2 * reals)
# 위는 특별한 T-Sigmoid 처리입니다. 여기서 IND 클래스 사이의 관계는 무시합니다.
probs1, probs2 = tf.nn.softmax(logits1), tf.nn.softmax(logits2)
# 위는 특별한 Softmax 처리입니다. 여기서 IND 클래스 사이에 갭을 줍니다.
loss2 = tf.losses.binary_crossentropy(
    reals,
    probs1 * (1 - reals) * knowns + #OOD는 무시합니다.
    probs2 * reals)
```
