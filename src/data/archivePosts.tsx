import type { ReactNode } from "react";

export type ArchivePost = {
  slug: "capsule" | "rainbow" | "ai-tutor";
  title: string;
  date: string;
  authors?: string;
  tags: string[];
  body: ReactNode;
};

const GH = "https://raw.githubusercontent.com/www0wwwjs1/Matrix-Capsules-EM-Tensorflow/bd5d2c6d/imgs";

export const ARCHIVE_POSTS: ArchivePost[] = [
  {
    slug: "capsule",
    title: "Matrix Capsule With EM Routing Reproduce Report",
    date: "2017-12-17",
    authors: "Hang Yu | Suofei Zhang",
    tags: ["Research Implementation"],
    body: (
      <>
        <p>Author: Hang Yu | Suofei Zhang</p>
        <p>Email: hangyu5 at illinois.edu | zhangsuofei at njupt.edu.cn</p>
        <h2>Introduction to Capsule</h2>
        <p>
          Capsule can be perceived as an extension of perceptron. A capsule is able in take an tensor as input and
          output an another tensor. The output tensor is called a pose. The activation of an capsule is usually the
          norm of a certain dimension of the pose, or it could be generated independently for this pose alone. The
          activation represents the existence of certain feature. A capsule layer carries both the pose and its
          activation to the next capsule layer.
        </p>
        <p>
          A deeper capsule doesn’t just simply read the output of a previous capsule layer. The poses and activations
          have to walk through a unsupervised learning procedure called “routing by agreement”. It allows training to
          learn from the distribution of input values by taking advantage of unsupervised learning methods. So that the
          training (i.e. supervised learning, e.g. image classification) is not longer dictated by the loss function
          alone, meaning the loss function (defined by us) and the data (defined by nature, collected by us) together
          contribute to the learning process.
        </p>
        <p>
          However, even though the capsule is a more exciting algorithm than its counterpart CNN. The CNN baseline is
          well implemented mostly which enables it to train faster in the physical world than the capsule net. We will
          leave the discussion to expert in this field.
        </p>
        <p>Abstract, introduction and contribution of [1] can be found in its paper. Details for our implementation can be found in [2].</p>
        <h2>Code of Conduct</h2>
        <blockquote>
          <p>
            Participants should produce a Reproducibility report, describing the target questions, experimental
            methodology, implementation details, analysis and discussion of findings, conclusions on reproducibility of
            the paper. This report should be posted as a contributed review on OpenReview.
            The result of the reproducibility study should NOT be a simple Pass / Fail outcome. The goal should be to
            identify which parts of the contribution can be reproduced, and at what cost in terms of resources
            (computation, time, people, development effort, communication with the authors).
          </p>
          <p>
            Participants should expect to engage in dialogue with ICLR authors through the OpenReview site. In cases
            where participants have made significant contributions to the final paper, ICLR should allow adding these
            participants as co-authors (at the request of the original authors only.)
          </p>
        </blockquote>
        <h2>Reproduce Method</h2>
        <h3>Hyperparameters</h3>
        <p>smallNORB dataset:</p>
        <ul>
          <li>Samples per epoch: 46800</li>
          <li>Sample dimensions: 96x96x1</li>
          <li>Batch size: 50</li>
          <li>
            Preprocessing:
            <ul>
              <li>
                training:
                <ol>
                  <li>add random brightness with max delta equals 32 / 255.</li>
                  <li>add random contrast with lower 0.5 and upper 1.5.</li>
                  <li>resize into HxW 48x48 with bilinear method.</li>
                  <li>crop into random HxW 32x32 piece.</li>
                  <li>apply batch norm to have zero mean and unit variance.</li>
                  <li>squash the image from 4 so that each entry has value from 0 to 1. This image is to be compared with the reconstructed image.</li>
                </ol>
              </li>
              <li>
                testing:
                <ol>
                  <li>resize into HxW 48x48 with bilinear method.</li>
                  <li>crop the center HxW 32x32 piece.</li>
                  <li>apply batch norm with moving mean and moving variance collected from training data set.</li>
                </ol>
              </li>
            </ul>
          </li>
        </ul>
        <h3>Method</h3>
        <ol>
          <li>
            The so called dynamic routing is in analog to the fully-connected layer in CNN. The so called ConvCaps
            structure extends dynamic routing into convolutional filter structure. The ConvCaps are implemented similarly
            as the dynamic routing for the whole feature map. The only difference is to tile the feature map into
            kernel-wise data and treat different kernels as batches. Then EM routing can be implemented within each
            batch in the same way as dynamic routing.
          </li>
          <li>
            Different initialization strategies are used for convolutional filters. Linear weights are initialized with
            Xavier method. Biases are initialized with truncated normal distribution. This configuration provide higher
            numerical stability of input to EM algorithm.
          </li>
          <li>
            The output of ConvCaps2 layer is processed by em routing with kernel size of 1*1. Then a global average
            pooling is deployed here to results final Class Capsules. Coordinate Addition is also injected during this
            stage.
          </li>
          <li>
            Equation 2 in E-step of Procedure 1 from original paper is replaced by products of probabilities directly.
            All the probabilities are normalized into [0, 10] for higher numerical stability in products. Due to the
            division in Equation 3, this operation will not impact the final result. Exponent and logarithm are also used
            here for the same purpose.
          </li>
          <li>
            A common l2 regularization of network parameters is considered in the loss function. Beside this,
            reconstruction loss and spread loss are implemented as the description in the original paper.
          </li>
          <li>Learning rate: starts from 1e-3, then decays exponentially in a rate of 0.8 for every 46800/50 steps, and ends in 1e-5 (applied for all trainings).</li>
          <li>We use Tensorflow 1.4 API and python programming language.</li>
        </ol>
        <h2>Reproduce Result</h2>
        <h3>Overview</h3>
        <p>Experiments on is done by Suofei Zhang. His hardware is:</p>
        <ul>
          <li>cpu：Intel(R) Xeon(R) CPU E5-2680 v4@ 2.40GHz</li>
          <li>gpu：Tesla P40</li>
        </ul>
        <p>
          <strong>On test accuracy</strong>:
        </p>
        <p>smallNORB dataset test accuracy (our result/proposed result):</p>
        <ul>
          <li>CNN baseline (4.2M): 88.7%(best)/94.8%</li>
          <li>Matrix Cap with EM routing (310K, 2 iteration): 91.8%(best)/98.6%</li>
        </ul>
        <p>There are two comments to make:</p>
        <ol>
          <li>Even though the best of Matrix Cap is over by 3% to the best of CNN baseline, the test curve suggest Matrix Cap fluctuates between roughly 80% to 90% test dataset.</li>
          <li>We are curious to know the learning curve and test curve that can be generated by the author.</li>
        </ol>
        <p>
          <strong>Training speed</strong>:
        </p>
        <ol>
          <li>CNN baseline costs 6m to train 50 epochs on smallNORB dataset. Each batch costs about 0.006s.</li>
          <li>Matrix Cap costs 15h55m36s to train. Each batch costs about 1.2s.</li>
        </ol>
        <p>
          <strong>Recon image</strong>: Will come soon.
        </p>
        <p>
          <strong>routing histogram</strong>: We have difficulty in understanding how the histogram is calculated.
        </p>
        <p>
          <strong>AD attack</strong>: We haven’t planned to run AD attack yet.
        </p>
        <h3>Notes</h3>
        <blockquote>
          <p>
            <strong>Status:</strong>
            According to github commit history, this reproduce project had its init commit on Nov.19th. We started writing
            this report on Dec.19th. Mainly, it is cost by undedicated code review so that we have to fix bug and run it
            again, otherwise the project should be able to finish in a week.
          </p>
          <p>
            <strong>Current Results on smallNORB:</strong>
          </p>
          <ul>
            <li>
              Configuration: A=32, B=8, C=16, D=16, batch_size=50, iteration number of EM routing: 2, with Coordinate
              Addition, spread loss, batch normalization
            </li>
            <li>
              Training loss. Variation of loss is suppressed by batch normalization. However there still exists a gap
              between our best results and the reported results in the original paper.
            </li>
          </ul>
        </blockquote>
        <p>
          <img src={`${GH}/spread_loss_norb.png`} alt="spread loss on smallNORB" />
        </p>
        <ul>
          <li>
            Test accuracy (current best result is 91.8%)
            <img src={`${GH}/test_accuracy_norb.png`} alt="test accuracy on smallNORB" />
          </li>
        </ul>
        <blockquote>
          <p>
            <strong>Ablation Study on smallNORB:</strong>
          </p>
          <ul>
            <li>
              Configuration: A=32, B=8, C=16, D=16, batch_size=32, iteration number of EM routing: 2, with Coordinate
              Addition, spread loss, test accuracy is 79.8%.
            </li>
          </ul>
          <p>
            <strong>Current Results on MNIST:</strong>
          </p>
          <ul>
            <li>
              Configuration: A=32, B=8, C=16, D=16, batch_size=50, iteration number of EM routing: 2, with Coordinate
              Addition, spread loss, batch normalization, reconstruction loss.
            </li>
          </ul>
        </blockquote>
        <p>
          Training loss.
          <img src={`${GH}/training_loss.png`} alt="MNIST training loss" />
        </p>
        <p>
          Test accuracy (current best result is 99.3%, only 10% samples are used in test)
          <img src={`${GH}/test_accuracy.png`} alt="MNIST test accuracy" />
        </p>
        <h2>Reference</h2>
        <p>
          [1]{" "}
          <a href="https://openreview.net/pdf?id=HJWLfGWRb" target="_blank" rel="noopener">
            MATRIX CAPSULES WITH EM ROUTING (paper)
          </a>
        </p>
        <p>
          [2]{" "}
          <a href="https://github.com/www0wwwjs1/Matrix-Capsules-EM-Tensorflow/" target="_blank" rel="noopener">
            Matrix-Capsules-EM-Tensorflow (our github repo: code and comments)
          </a>
        </p>
      </>
    ),
  },
  {
    slug: "rainbow",
    title: "DeepMind Rainbow: Review",
    date: "2017-12-16",
    tags: ["NNArchitecture"],
    body: (
      <>
        <h2>Introduction</h2>
        <p>
          Since the publication of{" "}
          <a href="https://www.cs.toronto.edu/~vmnih/docs/dqn.pdf" target="_blank" rel="noopener">
            Playing Atari with Deep Reinforcement Learning
          </a>
          , there are six extensions (彩虹) further developed by DeepMind:
        </p>
        <ol>
          <li>
            <a href="https://arxiv.org/pdf/1509.06461.pdf" target="_blank" rel="noopener">
              Deep Reinforcement Learning with Double Q-learning - 2015
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1511.05952.pdf" target="_blank" rel="noopener">
              Prioritized Experience Replay - 2015
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1511.06581.pdf" target="_blank" rel="noopener">
              Dueling Network Architectures for Deep Reinforcement Learning - 2015
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1602.01783.pdf" target="_blank" rel="noopener">
              Asynchronous Methods for Deep Reinforcement Learning 2016
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1706.10295.pdf" target="_blank" rel="noopener">
              Noisy Networks for Exploration - 2017
            </a>
          </li>
          <li>
            <a href="https://arxiv.org/pdf/1707.06887.pdf" target="_blank" rel="noopener">
              A Distributional Perspective on Reinforcement Learning - 2017
            </a>
          </li>
        </ol>
        <p>
          The Oct.6th published article —{" "}
          <a href="https://arxiv.org/pdf/1710.02298.pdf" target="_blank" rel="noopener">
            Rainbow: Combining Improvements in Deep Reinforcement Learning
          </a>{" "}
          tries combine the above six method together. It shows promising and expected result. More interestingly,
          figure 3 revels the marginal improvement offered by each extension:
        </p>
        <h2>Which extension is outstanding?</h2>
        <p>The original Figure 3 host (jianshu) is dead. The argument from that figure stands:</p>
        <ul>
          <li>N-step return, prioritized replay and distributional Bellman generate the biggest marginal improvement individually.</li>
          <li>Dueling and Double Q offer the smallest improvement among all extensions.</li>
        </ul>
        <p>We know that:</p>
        <ul>
          <li>Dueling is a method to decompose state-action value in order to the concept of advantage.</li>
          <li>Double Q is a counter method for overestimating state-action value.</li>
          <li>Basically Dueling and Double Q are dealing with the same issue – better estimate the Q value with its defined target (i.e. to reduce variance and bias).</li>
        </ul>
        <p>We also know that:</p>
        <ul>
          <li>N-step return helps the RL agent learn from a policy that result in the best future n step return.</li>
          <li>Prioritized replay tracks rare reward signals that help quicker learning.</li>
          <li>Distributional Bellman equation treat the “value function” as a distribution of rewards.</li>
          <li>These three extension aim to create/select a better target for the action-value function to learn.</li>
        </ul>
        <h2>Conclusion</h2>
        <p>
          With that said, combining the result of Fig3, we are able to conclude that for a value-based method: Having
          better target to learn is generally more effective than learning target better.
        </p>
        <p>Further, adding a final noisy dense layer does help exploring (i.e. finding better target to learn) in general.</p>
        <p>
          Also, Figure 1 shows prioritized DQN, and Distributional DQN are about the same level. DDQN aided by Dueling
          is better than plain DDQN. Besides plain DDQN &gt; plain DQN, this implies Dueling and Double Q (both are
          learning target better method) are good combination, but Dueling DDQN barely matches prioritized DQN, and
          Distributional DQN (which are learning better target).
        </p>
        <p>
          And going back to Figure3, <strong>it seems like Rainbow only needs one “learning target better” method</strong>.
          And it would be interesting to see how Rainbow performs without Dueling &amp; Double Q.
        </p>
      </>
    ),
  },
  {
    slug: "ai-tutor",
    title: "AI 导师与人类导师的差距：成分拆解、证据谱系与动机设计",
    date: "2026-10-01",
    authors: "Hang Yu",
    tags: ["AI 教育", "Research Review"],
    body: (
      <>
        <p>「AI 有多接近人类导师」这个问题问不出可用答案，因为人类导师本身不是一个数。它是四种机制的合成：掌握门控（mastery learning 中「未达标准就不推进」的硬性关卡）、实时诊断反馈、自适应节奏，以及人际与动机成分（ZPD，最近发展区，维果茨基定义为儿童在成人引导下能达到、独自达不到的能力区间）。这四种成分的替代进度差异极大，因此同一个系统完全可以在某些指标上超过人类一对一导师，同时在另一些指标上造成净伤害。这两件事不矛盾，因为量的根本不是同一个东西。</p>
        <p>可操作的提法因此是：AI 在人类导师的哪一个成分上替代了多少，代价是什么。成分是可以拆开单独拿的，而其中体量最大的一块并不需要 AI。动机成分是唯一一块 AI 无法替代的，也因此是唯一一块必须由人自己设计好的。</p>
        <h2>一、问题表述与度量口径</h2>
        <h3>人类导师的四个可分离成分</h3>
        <p>把 1:1 辅导拆开，历史上被独立测量过的部分有四类。Bloom 1984 年那张著名的可改变变量表给出了各自的效应量与百分位等值：tutorial instruction 为 2.00 SD（第 98 百分位），reinforcement 为 1.2，而 feedback-corrective (mastery learning)、cues and explanations、classroom participation、time on task 均为 1.00（约第 84 百分位）以上【1】。</p>
        <p>这个分布本身就给出第一个判断：被测到的增益里，很大一块并不来自「有人」，而来自「卡住不放行 + 立即反馈 + 反复重测」。这三种机制可以用软件实现，但它们跟大语言模型没有关系。von Hippel 2024 年在 Education Next 上重访这个结论时估计，测试与反馈而非辅导本身贡献了约一半的增益【2】。</p>
        <p>VanLehn 2011 年对辅导类实验的大规模综述给出了更锋利的对照。领域当时的普遍信念是人类成人导师 d = 2.0、智能辅导系统 d = 1.0、答案级计算机辅导 d = 0.3；该综述的实测结果是人类 1:1 辅导 d = 0.79、智能辅导系统 d = 0.76【3】。也就是说，人类导师的先验值被高估了一倍多，而 ITS 与人类的差距远小于通常认为的。</p>
        <h3>效果的四类测量</h3>
        <p>同一套系统在四类测量上的表现可以差出符号：</p>
        <ul>
        <li><strong>即时练习分</strong>。AI 辅助下的当次做题正确率。这是最容易测、也最容易好看的一类。</li>
        <li><strong>无辅助留存</strong>。撤掉 AI 之后，在未见题目上的表现。这才对应真实能力。</li>
        <li><strong>迁移</strong>。换题型、换表征、换场景后是否仍然成立。绝大多数研究根本没测。</li>
        <li><strong>动机与参与</strong>。自我调节、元认知准确性、坚持度。这类的测量工具本身就不成熟。</li>
        </ul>
        <p>把这两组维度交叉，能得到一张解释全部矛盾的地图：</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>人类导师成分 ↓ / 测量类型 →</th>
        <th>即时练习分</th>
        <th>无辅助留存</th>
        <th>迁移</th>
        <th>动机与参与</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>掌握门控</td><td>高（且无需 AI）</td><td>中（需重测机制配合）</td><td>几乎无数据</td><td>低</td></tr>
        <tr><td>实时诊断反馈</td><td>很高</td><td>中</td><td>低</td><td>低</td></tr>
        <tr><td>自适应节奏</td><td>高</td><td>低至中</td><td>几乎没有证据</td><td>低</td></tr>
        <tr><td>人际与动机</td><td>中（用交互次数代理）</td><td>低</td><td>几乎没有数据</td><td>唯一无法替代</td></tr>
        </tbody>
        </table>
        </div>
        <p>读法是这样的：越靠左、越靠上的格子证据越充分，越靠右越靠下的格子越接近空白。AI 在「实时诊断反馈」这一格上的进展最实在，在「掌握门控」上进展有限但价值高且不依赖 AI，在「自适应节奏」上被宣传得最多而证据最薄，在「人际与动机」上基本没有替代方案。右下角那一格是空白的，原因是那里根本没有人在研究。</p>
        <h3>2 sigma 标尺的来源与失真</h3>
        <p>2 sigma 这个数字被引用的方式，几乎总是错的。原始研究是 Bloom 分析其博士生 Joanne Anania 与 J. Arthur Burke 的两篇博士论文，三臂设计为常规课堂（约 30 人）、掌握学习课堂，以及 1:1 辅导加掌握学习【1】。</p>
        <p>问题在于，被广泛引用的 2.0 SD 并非这个研究的直接结论。von Hippel 的重访指出，Anania 与 Burke 测的并不是「辅导」本身，而是辅导、导师训练与指导、额外学习时间、频繁测试、反馈与重测的组合；测试内容高度特定，落在三周内、4–5 年级概率与 8 年级地图学这类窄知识点上【2】。该文还直接对 AI 宣称提出质疑：产生三分之一标准差的收益就已是大胜，从 AI 承诺 2 sigma 效应显得轻率，毕竟人类辅导本身也很少产生如此大的效应。</p>
        <p>用错标尺的代价可以直接量化。以 2.0 SD 为参照，现代量级在 0.29–0.79 之间，任何把它们说成「接近或超越 2 sigma」的表述都会把真实结果夸大 2.5 到 6 倍。更直接的影响是叙事闭环：Sal Khan 2023 年宣布 Khanmigo 的 TEDx 演讲标题正是《The Two Sigma Solution》，而该产品自己的 2026 年 NBER 试验发现年增益约 0.06–0.08 SD【11】，与不使用 AI 的纯练习平台几乎相同。</p>
        <h2>二、效应量谱系与测量条件</h2>
        <p>下表把历史标尺与 2024–2026 年的核心实证并置。决定读法的是最后两列——测量时点与是否允许 AI 在场，因为同一套系统在两列上可以给出方向相反的结论。</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>研究</th>
        <th>干预 vs 对照</th>
        <th>测量</th>
        <th>效应量</th>
        <th>是否无辅助</th>
        <th>样本与场景</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>Bloom 1984【1】</td><td>1:1 辅导 + 掌握学习 vs 常规课堂</td><td>窄知识点测验</td><td>2.00 SD</td><td>是</td><td>美国中学生，3 周内容</td></tr>
        <tr><td>VanLehn 2011【3】</td><td>人类 1:1 vs 无辅导</td><td>跨实验合并</td><td>d = 0.79</td><td>是</td><td>综述</td></tr>
        <tr><td>VanLehn 2011【3】</td><td>ITS vs 无辅导</td><td>跨实验合并</td><td>d = 0.76</td><td>是</td><td>综述</td></tr>
        <tr><td>Kestin 2025【4】</td><td>GPT-4 导师（含专家预写解法）vs 同班课堂</td><td>期末考试</td><td>0.73–1.3 SD</td><td>是</td><td>美国大学物理，N = 194</td></tr>
        <tr><td>Bastani 2025 GPT Tutor【5】</td><td>护栏式 AI 导师 vs 常规教学</td><td>练习分</td><td>+127%</td><td>否</td><td>美国高中生数学，约 1000 人</td></tr>
        <tr><td>Bastani 2025 GPT Tutor【5】</td><td>同上</td><td>撤除 AI 后考试</td><td>与对照无差异</td><td>是</td><td>同上</td></tr>
        <tr><td>Bastani 2025 GPT Base【5】</td><td>通用 ChatGPT vs 常规教学</td><td>练习分</td><td>+48%</td><td>否</td><td>同上</td></tr>
        <tr><td>Bastani 2025 GPT Base【5】</td><td>同上</td><td>撤除 AI 后考试</td><td><strong>−17%</strong></td><td>是</td><td>同上</td></tr>
        <tr><td>Chung 2026 台北【6】</td><td>护栏 + 自适应出题 vs 非自适应护栏</td><td>线下纸质期末考</td><td>+0.156 SD</td><td>是</td><td>台北 10 所高中，770 人</td></tr>
        <tr><td>Chung 2026 新手子样本【6】</td><td>同上</td><td>同上</td><td>+0.215 SD（p = 0.012）</td><td>是</td><td>同上</td></tr>
        <tr><td>Chung 2026 有基础子样本【6】</td><td>同上</td><td>同上</td><td>+0.008 SD（不显著）</td><td>是</td><td>同上</td></tr>
        <tr><td>StudentBench 2026【7】</td><td>AI 导师 vs 人类一对一</td><td>新题即时</td><td>−0.58pp，90% CI [−2.18, 1.03]；等效检验通过</td><td>部分</td><td>2,383 人；人类臂仅 140 场</td></tr>
        <tr><td>StudentBench 2026【7】</td><td>同上</td><td>三域文字题</td><td>未通过等效检验</td><td>部分</td><td>同上</td></tr>
        <tr><td>Worden 2026 研究一【8】</td><td>LLM 反馈 vs 仅对错反馈</td><td>下一题正确率</td><td>+7%，仅低知识学生</td><td>部分</td><td>美国初中数学，20,706 人</td></tr>
        <tr><td>Worden 2026 研究二【8】</td><td>LLM 反馈 vs 专家教师反馈</td><td>学习结果</td><td>与教师反馈相当</td><td>部分</td><td>12,950 人</td></tr>
        <tr><td>Ma 2026 中国农村【9】</td><td>个性化 AI-CAL vs 非个性化 CAL</td><td>学习成绩</td><td>不显著，精确到可排除非平凡正效应</td><td>是</td><td>中国农村小学，8,647 人 / 315 班</td></tr>
        <tr><td>Harrison 2026 Medly【10】</td><td>AI 辅导 vs 常规自主复习</td><td>课程对齐后测</td><td>g = 0.33（95% CI 0.18–0.48）</td><td>部分</td><td>英国 GCSE 科学，929 入组 / 644 完成</td></tr>
        <tr><td>Oreopoulos &amp; Low 2026【11】</td><td>Khanmigo + 练习平台 vs 常规补救</td><td>全国百分位等级/学期</td><td>0.040 SD 总体；0.084 SD（第二年）</td><td>是</td><td>美国田纳西州 18 校，5 个学期</td></tr>
        <tr><td>NUMI 掌握度实验【12】</td><td>AI 支持 vs 无 AI</td><td>一周后延迟测</td><td>Mastery × AI 系数 0.085（边缘显著）</td><td>是</td><td>美国田纳西州 Hamilton County</td></tr>
        <tr><td>NUMI 掌握度实验【12】</td><td>三连对规则 vs 无</td><td>一周后延迟测</td><td>平台掌握率 +28.7pp，延迟测无增益</td><td>是</td><td>同上</td></tr>
        <tr><td>Tutor CoPilot【13】</td><td>AI 辅助真人导师 vs 无 AI</td><td>exit ticket 通过率</td><td>+4pp；低评级导师的学生 +9pp</td><td>否</td><td>美国 K-12，900 导师 / 1,787 学生</td></tr>
        </tbody>
        </table>
        </div>
        <p>把无辅助行单独抽出来看，格局就清楚了。所有数值达到 0.5 SD 以上的现代证据，要么是 Kestin 那样由专家预写解法、限定在中阶认知技能的窄场景，要么是历史标尺本身。而 2026 年三个更大样本、更贴近真实教学场景的现代设计——台北 770 人、Medly 644 人、田纳西 5 个学期——效应量分别落在 0.04 到 0.33 SD 区间。宣传数字与承重数字之间的差距，主要由「是否允许 AI 在场」这一列解释。</p>
        <h3>数据分歧的机制归因</h3>
        <p>Bastani 2025 年的三臂设计是分歧的源头，也是最有信息量的单一实验。GPT Base 组把通用模型当解题工具，练习分 +48%，但撤除 AI 后比对照组低 17%，57 道题中出现了逻辑与算术错误。GPT Tutor 组配置为不给直接答案，练习分 +127%，撤除 AI 后与对照组无差异。同一篇论文里，护栏组的符号与无护栏组相反【5】。</p>
        <p>这组结果纠正了一个根深蒂固的误读。护栏的收益不是「有效」而是「不受伤」。−17% 变成 0，不等于变成正。台北研究【6】进一步显示，护栏本身也不产生留存收益：该项目两臂都带 withhold 保护，唯一差异是出题顺序，差异却仍给出 +0.156 SD。增益来自自适应序列，而非来自禁止代劳。</p>
        <p>同一篇论文还有一个容易被跳过的发现：GPT Base 组学生的自评学习水平与考试表现和对照组持平，即他们对自身学习的判断是失准的。这与 2026 年 CS1 课程的一项 RCT 方向一致——该研究按 ICAP 框架（把学习活动按互动强度排为被动、主动、建构、互动四档）设置了四个条件，条件间在提示能力上依次递增，验证了互动强度阶梯，但组间并未出现直接的学习结果差异【14】。</p>
        <h3>小样本校正的修正幅度</h3>
        <p>领域对外宣传的合并效应量普遍建立在偏差校正之前。2026 年一组 meta 分析报告的观测合并值落在 0.67 到 0.87 之间，其中至少一项明确报告了 PET-PEESE 小样本偏差校正后回落至 0.26–0.45，且 95% 预测区间跨越零。</p>
        <p>这组 meta 分析的原始出处未在本报告的核验范围内逐条回溯，因此其数值不用于任何承重结论，也不出现在上表。读者若要引用，应先自行核对原文。真正需要记住的是方法论层面的那一条：观测到的 g 不是效应，预测新场景的效应要用预测区间，而两者的差距在小样本高异质性研究里可以达到数倍。这个模式会在第六章再次出现，而那一次的差距更大。</p>
        <h2>三、技术形态与失效模式</h2>
        <h3>四类 AI 导师的架构分野</h3>
        <p>把「AI tutor」当成一个东西会持续制造矛盾。它实际上指四类架构，证据基础和失效模式完全不同：</p>
        <ol>
        <li><strong>pre-LLM 智能辅导系统（ITS）</strong>。步骤级反馈 + 知识追踪（BKT 等贝叶斯知识追踪模型，估计学生对每个知识点的掌握概率）+ 确定性规则。代表是 Cognitive Tutor、ASSISTments、MATHia。</li>
        <li><strong>LLM 对话导师</strong>。大模型驱动，靠提示词与 RAG 接地约束行为，代表是 Kestin 的物理导师、台北项目。</li>
        <li><strong>通用聊天机器人</strong>。无教学约束的通用对话产品，ChatGPT 直接用即属此类。</li>
        <li><strong>人机混合</strong>。AI 不直接面对学生，而是增强人类导师，代表是 Tutor CoPilot。</li>
        </ol>
        <p>四类之中，ITS 的历史证据最扎实。VanLehn 综述给出 d = 0.76，与人类 1:1 的 0.79 几乎持平【3】。但 2026 年针对个性化计算机辅助学习的大规模检验给出了一个刺眼的零结果：Ma 等人在中国农村小学随机分配 8,647 名学生、315 个班到三臂——个性化 AI-CAL、非个性化 CAL（主动对照）、非 CAL 教学活动（纯对照）。AI-CAL 没有显著提升成绩，估计值精确到可以排除非平凡的正效应，且该结论在题目难度分层和基线成绩分层上都稳健；非个性化 CAL 则在中等能力三分位学生中有小幅收益【9】。</p>
        <p>这是自适应成分最薄的一处证据，而且样本量足够大、场景足够真实。</p>
        <h3>前沿模型的过度脚手架倾向</h3>
        <p>Allen Institute for AI 2026 年发布的 TutorMoments 基准，用 462 份去标识化的一对一数学辅导转录和超过 1,500 个教师标注的教学决策点，把七个主流模型放进真实转录的决策点接管导师角色五轮。学生角色由另一个模型模拟。结论是：只用「好好教」一句话提示时，模型普遍过度脚手架，很少在学生已经准备好时推动严谨性；把「何时帮助 / 何时克制 / 何时过度」的权衡写进提示词后每个模型的分数都上升，但差距没有闭合，模型之间的解读差异依然很大【15】。</p>
        <p>该基准里最容易被误读的数字是它的人类参照。同一批决策点上，真实人类导师得分为恰当脚手架 0.458、恰当推动严谨性 0.182、避免过度脚手架 0.496，全部低于模型在评估感知提示下的得分。作者明确声明这不构成「AI 导师超过教师」的结论，理由是标注者本来就是在刻意寻找辅导可以更好的时刻，数据集因此集中在错失的机会上而非理想实践；而且分数衡量的是导师行为而非学习结果，回放用的是模拟学生【15】。</p>
        <p>一个更少被讨论但更硬的约束来自同一份材料：延迟。表现最好的两个模型让学生等待首个可见 token 的中位时间是 8.5 到 9 秒，Gemini 2.5 Pro 为 14 秒，而人类语音延迟约 100–200 毫秒，Zoom 上的人类约 500–1000 毫秒【15】。在需要即时反馈才能维持 productive struggle（有益的困难，指学习者独立克服恰好略超当前能力的障碍，是 Bjork 提出的概念）的教学场景里，这个量级的延迟不是体验问题，而是机制问题。</p>
        <h3>帮助度判据的教学失效</h3>
        <p>TutorMoments 指向的是一个更根本的错配：通用模型的后训练优化目标是「帮助性」，而教学需要的是「恰当时机的恰当帮助」。一项预注册审计把同一冻结底模只替换教学策略，对比最小调用式 ConvTutor 与经学习者状态路由的 PedTutor，用 Claude Opus 4.8 冻结评委与 GPT-5.6 事后审计，评估 1,179 个确认性答案阶段的导师回合【17】。</p>
        <p>结果有三层。策略之间在「帮助性」评分上无显著差异，但在教学法评分下完全秩分离（Cliff's |δ| 从 0.10 到 1.0）。帮助性排序在不同评委之间会翻转，三个底模中有两个出现翻转。而泄露答案的回合之后，学生的独立作业量一律更少【17】。</p>
        <p>推论很直接：把模型的「有用」评分当作教学质量的代理指标，会系统性地选错系统。评估必须由教学法 rubric 承担，而 rubric 必须随底模冻结。</p>
        <h2>四、机制链条与设计变量</h2>
        <h3>学习者的三条负向机制</h3>
        <p>负向结果的来源可以归为三条可分别观察的机制。</p>
        <p><strong>认知卸载</strong>指把本应内化的加工过程外包给外部工具。Favero 等人对 49 篇国际文凭论文的探索性分析发现，80% 的作文明确指出 AI 依赖削弱了思考，53% 至少命名了一种「支持而非替代思考」的行为，但 48 篇之 49 的实际写作框架仍然是替代而非脚手架【16】。</p>
        <p><strong>元认知监控削弱</strong>表现为对自身学习状态判断失准。Bastani 2025 的 GPT Base 组是最干净的证据：练习分 +48%、撤除后 −17%，而学生对自身学习的自评与对照组持平【5】。</p>
        <p><strong>有益困难被侵蚀</strong>表现为 tutor 替学习者完成本应承受的推理。TutorMoments 中「模型倾向过度帮助且策略集合更窄、主要靠让学生解释答案」正是这一条的行为侧写【15】。</p>
        <p>三条机制都不是模型能力不足，而是训练目标与教学目标的方向差。把护栏当作能力修补是对问题的误诊。</p>
        <h3>设计变量的证据与失效条件</h3>
        <p>下表把六个常被当作「最佳实践」的设计变量按证据强度排序，并逐项标注它在什么条件下会失效。看点不在强度列的排序，而在最右列——多数失效条件与强度高低无关。</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>设计变量</th>
        <th>证据强度</th>
        <th>失效条件</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>withhold（护栏）</td><td>强。Bastani 无护栏 −17% vs 台北有护栏 +0.156 SD，同源团队符号翻转【5】【6】</td><td>只把负效应归零，不产生正留存收益</td></tr>
        <tr><td>scaffold 而非 substitute</td><td>中。Favero 的设计原则与 TutorMoments 的行为 profile 一致【15】【16】</td><td>脚手架超出情境所需即构成过度脚手架</td></tr>
        <tr><td>feedback 时机</td><td>中。混合反馈的合并效应量高于纯即时与纯延迟两种单一策略</td><td>效应量随异质性大，校正后不稳定</td></tr>
        <tr><td>human-in-loop</td><td>中。Tutor CoPilot 整体 +4pp，低评级导师的学生 +9pp【13】</td><td>反馈建议常不适合该年级水平；只测 exit ticket，未测年末统考</td></tr>
        <tr><td>RAG / 形式知识库接地</td><td>中。von Hippel 观察到纯 LLM 教基础概念时「很快迷路」，与认知导师或数学引擎组合才有前景【2】</td><td>接地库覆盖不到的概念仍会退化</td></tr>
        <tr><td>fading（逐步撤除支持）</td><td>弱。规则引导式分层架构在 40 人课堂试点中改善交互一致性、减少过早给答案</td><td>规模小、周期短，未见无辅助测量</td></tr>
        </tbody>
        </table>
        </div>
        <p>这六个变量里，证据最硬的是 withhold，而且它的作用方式最反直觉：它防止损失，不创造收益。真正在无辅助考试上产生正增益的设计，目前只有台北一项，而其增益来源被作者归于自适应出题序列而非护栏本身。</p>
        <h3>护栏的有效作用边界</h3>
        <p>护栏被过度推广时会掩盖一个重要事实。Bastani 的 GPT Tutor 组撤除 AI 后与对照组无差异，护栏把 −17% 拉回到 0 而没有推到正数。NUMI 实验提供了同构的第二个证据：要求连对三次的掌握度规则把平台定义的掌握率抬高约 28.7 个百分点，但一周后的延迟测没有可检出的增益【12】。</p>
        <p>平台指标与学习指标是两件事。任何用完成率、掌握率、答题数、互动轮次作为效果代理的设计，都在把 0 的护栏效果展示成正数。对学习者而言，判据只能是撤掉辅助之后的表现。</p>
        <h2>五、动机工程与游戏化设计</h2>
        <p>把学习做成「上瘾」这个目标，在神经科学层面是反的。成瘾的定义本身就是对自然奖励的反应钝化加上对线索的敏感化，恰好是想要训练出来的那种东西的反面。有效的替代物存在，而且不止一个，但没有一个是奖励。</p>
        <h3>「上瘾」框架的失效之处</h3>
        <p>支点是 Berridge 关于 wanting 与 liking 的解离。多巴胺在中脑-伏隔核通路的主要功能是「想要」，即 incentive salience（激励显著性，把某个奖励线索标记为值得追逐的那种心理磁性），而不是「喜欢」。证据是两组互补实验：把大鼠的多巴胺神经元用神经毒素摧毁，它们仍然对糖表现出正常的享乐反应（伸舌、侧向咀嚼、正向面部表情），但完全停止为获取食物付出努力；反过来，刺激伏隔核多巴胺让大鼠为食物付出的努力成倍上升，享乐反应却不增强【18】。</p>
        <p>成瘾正是这两者被推向极端的分离。反复暴露导致敏化，want 越来越强；同时产生耐受，like 越来越弱。成瘾者报告「不再感到愉悦」却仍在强迫性地寻找，这不是意志薄弱，是 wanting 与 liking 的解耦。敏化甚至可以在完全戒断多年后持续存在。</p>
        <p>由此，「对学习上瘾」在字面意义上是一个自相矛盾的目标。成瘾的判定标准之一就是对本来无害的自然奖赏失去反应，而你要的恰恰相反。流行语里的「多巴胺重置」与「多巴胺排毒」同样缺乏依据——健康神经元的多巴胺无法通过行为性节制被有意义地耗竭，这类做法若有效，来源不是多巴胺水平。</p>
        <p>不过「长期多巴胺目标」这个说法可以按它本来的意思救回来。培养对长期目标的 incentive salience 是真实且可行的，它对应的是想要、驱力与努力分配，而不是快感。奖励预测误差框架说的是同一件事：多巴胺神经元编码的是实际结果与预期之间的偏差，因此当奖励变得可预测之后几乎不再响应。这解释了一个常见现象——稳定可见的进步会让动力在初期强、随后弱，而真正让人重新上劲的不是加大奖励，是重新制造可预测性的缺口。</p>
        <h3>目标意图与实施意图的落差</h3>
        <p>「设置高远目标」是必要的，但单独用它不足以启动任何行为。Webb 与 Sheeran 的元分析显示，能产生中到高强度行为意图改变的干预，只带来小到中等的行为改变，d = 0.36。意图与行动是心理上不同的过程，需要不同的干预成分。</p>
        <p>Gollwitzer 与 Sheeran 2006 年对 94 项独立检验的元分析给出了一条窄路：在目标之外再加一条 if-then 计划——「如果情境 Y 出现，那么我就发起行为 X」——目标达成的效应是中到大，d = 0.65【25】。值得注意的是，这个数字在近二十年里被反复引用，但同一条轨迹上的更新版本把样本扩到 642 项检验后，总体效应降到 d = 0.36（95% CI 0.33–0.40），其中行为改变一项 d = 0.27，经稳健贝叶斯校正后进一步降到 d = 0.15（95% CI 0.08–0.22）。这与第二章的偏差校正模式完全一致：观测效应量与校正后效应量不是同一个数，而传播的几乎总是前者。这一更新的原始记录未在本报告的核验范围内回溯，故其数值不用于承重结论。</p>
        <p>实施意图的机制是线索可及性加上启动自动化，Gollwitzer 称之为 strategic automaticity。它不改变你的动机，只把「决定做」这一步的成本前置到事先。因此它与习惯不同：线索提示你打开书，不会替你读完。效果最强的场景恰恰是最容易失败准备的场景——高认知负荷、情绪耗竭、时间压力、有强竞争性替代行为时。</p>
        <p>所以「设定高远目标」的正确形式不是一句宣言，而是三件套：一条长期目标，一组 if-then 的线索-行为配对，以及一个事先写好的中断后重启规则。第三件最容易被省略，也最容易决定长期成败。</p>
        <h3>好奇的信息缺口机制</h3>
        <p>「无聊来勾起好奇心和未知」这条直觉是对的，而且有比直觉本身更精确的理论。</p>
        <p>Loewenstein 1994 年的信息缺口理论认为，好奇心在注意力集中到知识缺口时产生，缺口带来剥夺感，从而驱动信息寻求。但关键在理论的后半句，它比前半句反直觉得多：<strong>部分知识比完全无知更能产生好奇</strong>。你必须先知道一点，才看得见缺了什么。对一个从未听说过的领域不会有好奇心，这正是「这很无聊」经常是不熟悉而非学科本身沉闷的原因。</p>
        <p>这重新定义了「在奖励间隙创造简单问题」的功能。那个问题本身不产生好奇，它的功能是给出足够结构让缺口可见，而且必须连着一个真实缺口，否则它满足的是消遣性好奇——对新奇事物的一般性搜寻，表现为无限下滑式浏览，看起来像好奇心却几乎不产出任何东西。知识性好奇才是费力的、可持续的、发生学习的那一种。</p>
        <p>难度上还有一条倒 U。Berlyne 指出新异度过高引起焦虑，过低引起无聊，只有居中时好奇水平最高。这意味着「勾起好奇」与「制造焦虑」之间只有很窄的一条缝，而缝的宽度因人、因领域而异。</p>
        <p>一个值得注意的中文综述把这条链补全了。陈念劬 2023 年在《心理科学进展》上的综述给出好奇反馈循环模型，包含感知信息缺口、好奇发生、控制的期望价值评估、信息寻求、好奇满足、信息整合六个阶段，并整合了多巴胺与去甲肾上腺素系统的证据【19】。</p>
        <h3>雪球的真实来源</h3>
        <p>「滚雪球累计优势」同样成立，但雪球的材料不是积分。</p>
        <p>第一个雪球来自上面的好奇反馈循环：满足带来整合，整合扩展先验知识，扩展的知识让人更容易意识到下一个信息缺口，于是形成正反馈。滚雪球之所以能滚，是因为你每次都离下一个问题更近。</p>
        <p>第二个雪球在记忆侧。Cepeda 等 2006 年在 <em>Psychological Bulletin</em> 上汇总 317 项实验、184 篇文章中的 839 次间隔效应评估，结论是学习间隔与目标保持时长共同作用于最终成绩，且产生最佳保持效果的复习间隔随目标保持时长而增长【26】。机制上，间隔把复习变成提取而不是重读，提取的困难本身就是强化的来源。Karpicke 与 Roediger 2008 年在 <em>Science</em> 上报告间隔提取一周后保留 80%、集中重读仅 36%；该数字来自二手转述，未回溯原文。</p>
        <p>两个雪球的共同点是：它们都由结构产生，不由奖励产生。积分只累加，不复利；把第 1000 分和第 10 分放在同一条曲线上比较没有任何意义，因为它们之间没有因果联系。</p>
        <h3>间歇性奖励的机制混淆</h3>
        <p>「间歇性奖励」这一条在机制上混淆了两件不同的事，而这两件事在表面上看起来完全一样。</p>
        <p>需要间歇的是<strong>间隔</strong>，不是<strong>奖励</strong>。间隔效应是学习科学中复现最稳的发现之一，上面已经给出。而变动比率强化（variable ratio，每次奖励概率不定）是老虎机与成瘾物质的行为学基础，它产生的是最持久、最难被辨别、最容易窄化行为库的行为。把「学习要间歇」读成「学习要有时给奖励有时不给」，等于把一个有效的学习原则换成了一个有害的行为工程。</p>
        <p>判据是：间歇落在哪个维度上。落在<strong>时间维度</strong>上是间隔效应，落在<strong>结果维度</strong>上就是变动比率。前者让每次提取都更难，因此更有效；后者让每次戒断都更难。</p>
        <p>具体到设计：连击计数属于结果维度的间歇。它的作用是提高本题之后继续做题的速度，代价是让人倾向于追求连击而不是理解。更关键的是奖励是否携带信息。Sailer 与 Homner 2020 年对 30 项实验与准实验的元分析报告了三个结果：认知 g = 0.49（95% CI 0.30–0.69，k = 19，N = 1,686），动机 g = 0.36（95% CI 0.18–0.54，k = 16，N = 2,246），行为 g = 0.25（95% CI 0.04–0.46，k = 9，N = 951）【21】。但同一篇论文里还有一句更重要的话：在只保留高方法学严谨度的研究的子样本分析中，<strong>认知结果稳定，动机与行为结果不稳定</strong>。</p>
        <p>这句话把整章的论证合上了。游戏化确实改善学习成绩，这一点经得起方法学筛选；它对「你有多想做」和「你做了多少」的影响则经不起。把游戏化用来做留存，等于拿一个不稳的东西去换一个稳的东西。</p>
        <p>按游戏元素分解的元分析给出了进一步的警示。Zeng 等 2024 年汇总 2008 至 2023 年 22 项实验研究发现，积分加徽章加排行榜的组合 g = 0.842，而<strong>单纯积分一项 g = 2.153 但标准误 1.883，置信区间跨零</strong>，与零徽章的 g = 1.203（仅 3 项研究）同属不可解读的高值【22】。这类研究的异质性极高：另一项 2026 年的高等教育元分析报告 Q = 280.00，I² = 98.84%【23】。异质性到这个量级时，平均效应量本身的信息量有限。</p>
        <p>过度合理化效应是这套设计真正的代价。Deci、Koestner 与 Ryan 1999 年汇总 128 项研究的元分析报告，按奖励的依赖类型区分，行为依赖型奖励对自由选择行为的效应是 d = −0.40，完成依赖型 d = −0.36，表现依赖型 d = −0.28；在自我报告兴趣上，行为依赖型 d = −0.15，完成依赖型 d = −0.17。而正向反馈是唯一稳定提升的方向，自由选择行为 d = 0.33，自我报告兴趣 d = 0.31【20】。</p>
        <p>要点是：起破坏作用的是奖励的<strong>依赖性与显著性</strong>，不是奖励本身。口头表扬不破坏，甚至增强。而<strong>表现依赖型奖励正是连击、排行榜、积分这类设计所处的位置</strong>——按表现给分、按名次给奖、连对才算。这意味着每日打卡积分与排行榜恰好落在元分析里侵蚀最重的那一格，其数值甚至比另两类更接近零。</p>
        <p>需要补两点否定性证据，以免这一段被读成定论。该效应的强度一直有争议，Cameron 与 Pierce 1994 年对 45 项研究的元分析得出远小的负效应，r = −0.06；Eisenberger 与 Cameron 1996 年在 <em>American Psychologist</em> 上主张该效应基本是迷思，Deci 团队随后回应，这场争论至今没有定论。一项 2022 年用现代本科生重做 Deci 1971 年经典实验的研究也没有发现预期的负效应。此外，二手材料中广泛流传的若干数值，例如无趣任务上 d = 0.18、意外奖励 d = 0.01、表现分档 d = −0.80，并未出现在该论文的已发表摘要中，引用时应回到原文核对。</p>
        <h3>多巴胺目标与快感钝化</h3>
        <p>把本章的几条线索合起来看，「戒掉短期多巴胺目标、建立长期多巴胺目标」这个诉求的落点其实不在多巴胺上。</p>
        <p>短期目标的诱惑结构是可见的、即时的、确定有回报的，因此不需要任何意志力就能被激活。长期目标的结构恰好相反：延迟、不确定、回报概率未知。两者争夺的是同一个系统——想要。长期目标之所以难以启动，不是因为它不产生想要，而是因为<strong>在没有近期奖励信号的情况下，预测误差机制不会为它赋值</strong>。这就是为什么设目标本身不够：目标设得再高，如果头三个月内没有任何可见的进展信号，系统就永远不会为它分配激励显著性。</p>
        <p>因此可行的做法不是等待长期目标自然产生激励，而是给它人工制造预测误差。这正是信息缺口与间隔复习在动机层面做的事——它们不是辅助手段，它们就是长期目标的奖励供给方式。第三节和第四节描述的两个雪球，同时也是两个多巴胺调节装置。</p>
        <p>至于戒除不良嗜好，可用的杠杆同样不是意志力。行为习惯的模型是线索—行为—奖赏三段式，其中奖赏环节对已固化的习惯几乎不敏感，因为行为已经成为线索绑定的自动反应。因此对既有习惯有效的干预集中在线索端：移除线索、重构环境、改变默认值。对尚未建立的习惯，反过来是固定线索，用同一个情境重复同一动作，因为决定习惯能否形成的是<strong>情境稳定性</strong>而不是重复次数。这一非对称性是本章最容易被忽略、也最可操作的一条。</p>
        <h3>习惯化的路径与中断容差</h3>
        <p>Duolingo 是公开可查的、唯一把习惯机制做成 A/B 实验的产品。它的自报数据恰好说明了因果数字与相关性数字的量级差。下表按重要性排序因果估计量：</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>改动</th>
        <th>效应</th>
        <th>性质</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>Streak Wager：花游戏币赌自己连击 7 天</td><td>Day-1/7/14 留存显著上升，Day-7 留存 <strong>+14%</strong></td><td>因果</td></tr>
        <tr><td>降低连击门槛：单课即可续连击，每日目标进度单独显示</td><td>Day-14 留存 <strong>+3.3%</strong>；有连击的日活 <strong>+10.5%</strong>；新用户 <strong>+19%</strong></td><td>因果</td></tr>
        <tr><td>Weekend Amulet：周五付费可豁免周末断连击</td><td>一周后回访 <strong>+4%</strong>；断连击 <strong>−5%</strong></td><td>因果</td></tr>
        <tr><td>双倍 Streak Freeze</td><td>日活 <strong>+0.38%</strong></td><td>因果</td></tr>
        <tr><td>连击动画</td><td>7 日留存 <strong>+1.7%</strong></td><td>因果</td></tr>
        <tr><td>达到 7 天连击者次日回访概率</td><td>2.4×</td><td>相关性</td></tr>
        <tr><td>达到 7 天连击者完成课程概率</td><td>3.6×</td><td>相关性</td></tr>
        </tbody>
        </table>
        </div>
        <p>数据来自 Duolingo 自己的博客，属厂商自报，无同行评审、无置信区间、无独立审计【24】。读法是：因果数字比相关性数字小一到两个数量级。相关性数字主要是自我选择——能撑到第 7 天的人本来就是动机更强的人，把这个差异归因给连击机制是错的。</p>
        <p>而表里最有用的一条不是 +14%，是<strong>降低门槛</strong>那条拿到的新用户 +19%，以及 Weekend Amulet 那条：明确给出「可以休息」的许可，反而让人一周后更愿意回来。公司自己的表述是「给出休息选项的学习者，长期上做得更多」。这与习惯形成研究的结论一致——中位形成期约 66 天，而<strong>偶尔漏做不会显著破坏形成轨迹</strong>。</p>
        <p>三条规则因此可以直接写成：</p>
        <ol>
        <li>把习惯定义在地板上而不是天花板上——最小可行动作就算完成，全天目标单独追踪。+19% 那一行就是这个规则的全部内容。</li>
        <li>事先写进一次豁免额度，让中断在规则内而不是规则外。Lally 等人关于漏做不破坏轨迹的发现，是这条规则的经验依据；而「允许休息反而提高回访」是它的商业验证。</li>
        <li>中断后重新计数，但不清零到心理上的全白。因为断连击导致永久放弃，是连击机制最常见的失效方式，而一个允许一次豁免的设计同时解决了这条。</li>
        </ol>
        <p>最后必须指出连击计数器实际测量的东西。它测的是出勤。把它当作学习指标，就是把第二章那张表的最后两列再做一次同样的错。田纳西州那个案例给了具体量级：96% 的学生至少发过一次消息，但中位数学生只在 17% 的出错场次与 Khanmigo 对话，仅约 14.5% 的消息包含真实数学提问或推理步骤，约 40% 是裸答案；作者自己的结论是「约束条件似乎在参与度上」【11】。一个连击计数器对上述任何一项都不敏感。</p>
        <h2>六、中国语境的证据结构</h2>
        <h3>政策锚点与治理语言</h3>
        <p>中国大陆的政策锚点是教育部等五部门 2026 年 4 月 2 日印发的《「人工智能+教育」行动计划》（教科信〔2026〕1 号），目标为到 2030 年基本形成人工智能与教育深度融合格局【27】。文件确立的理念是「育人为本、素养为先、应用导向、智能向善」，并提出构建纵向贯通、横向联通的全学段人工智能教育体系。</p>
        <p>与技术判断直接相关的条款集中在两处。第六条要求「研发智能学伴」「建设学生数字档案，根据学生能力、特质和爱好动态优化学习路径」；第七条要求「辅助教师开展作业管理，推进智能批改、答疑和辅导」。第五章则把「应试内卷」「学术造假」与隐私泄露并列为需要防范的风险，并要求健全人工智能评估备案、技术监测、风险预警、应急响应机制【27】。</p>
        <p>值得注意的是政策文本的重心分布。批改、答疑、学伴、路径优化都落在诊断与反馈环节，而没有被表述为对话式陪练。这与上一节的证据形态吻合。</p>
        <h3>大样本的零结果</h3>
        <p>中国语境下唯一一个效应量级别的随机对照试验是 Ma 等人的农村小学研究，也是本文引用清单中唯一一个零结果【9】。它的设计质量值得单独说明：8,647 名学生、315 个班，三臂分配，主动对照与纯对照分离，结论在题目难度与基线成绩两个维度上都做了稳健性检验，且估计值精确到足以排除非平凡的正效应。</p>
        <p>作者的结论本身比数字更重要：非个性化 CAL 在中等能力三分位学生中有小幅收益，而 AI-CAL 在任一能力三分位中都没有影响；据此对在资源受限环境中规模化推广自适应 AI 教育技术应保持谨慎【9】。</p>
        <p>这个结果与厂商叙事方向相反，也与个人体验方向相反。把它放低处理是不合适的。</p>
        <h3>厂商层证据的结构性缺失</h3>
        <p>消费级 AI 学习设备这一层的公开信息里没有效应量，只有市场份额、营收、硬件参数与投诉量。据二手财经媒体报道，2026 年上半年中国学习平板市场销量同比下降 14.2%、销售额同比下降 10.2%，学而思学习机销量份额约 20%，科大讯飞约 17.9%；好未来 2026 财年净收入 30.09 亿美元、同比增长 33.7%，其中内容解决方案 10.62 亿美元、增长 48.4%，但学习设备业务仍处亏损状态、平均售价不足 4000 元；黑猫平台上与学而思相关的投诉超过 7000 条【28】。</p>
        <p>这批材料里唯一与教学效果直接相关的数字是批改准确率。有消费者在投诉中提及，AI 批改会把正确答案判错，销售人员的回应是 AI 准确率约为 85%【28】。也就是说，即便旗舰设备的批改环节，也大约每七次错一次。这个量级与 Bastani 在 GPT Base 组 57 道题中观察到逻辑与算术错误的方向一致【5】。</p>
        <p>厂商侧另有「4+1」标准、3 大类 3 层级 4000 余标签错因体系、覆盖高中数学 18 章 2542 考点等表述。这类数据的性质是厂商稿与专家鉴定结论，不应与随机对照试验的估计值平级引用。此处的判断是方向性的：中国落地的重心落在错因诊断与步骤级批改，与政策文本和 Worden 研究显示的证据强度分布一致【8】【27】。</p>
        <h2>七、个人应用与工程落点</h2>
        <h3>备考场景的留存约束</h3>
        <p>Bastani 的三臂可以直接映射到个人使用方式上。默认打开 AI 边做边问，等于 GPT Base 组：练习分 +48% 是真的，撤除后 −17% 也是真的。默认按「先不给答案」配置，等于 GPT Tutor 组：练习分 +127%，撤除后与纯自学的自己打平【5】。</p>
        <p>这两个数字的含义不同。前者说明 AI 让你现在感觉更好，同时让考试更难；后者说明配置能避免前者，但不会让你超过不配置时的自己。要产生正的无辅助收益，需要在护栏之上再加自适应序列，台北的 +0.156 SD 是目前唯一的现代证据【6】。</p>
        <p>可执行的做法是把「使用 AI 时的分数」和「撤掉 AI 后的分数」当成两个独立指标。前者是过程指标，后者是目标指标，两者不可互相替代。已有的模考机制（不接触 AI）本身就是一个留存测试，它的价值恰恰在于隔离，应当保持隔离，不要改成边做边问。</p>
        <p>同一逻辑也适用于学习习惯本身。习惯系统的作用是保证「撤掉外部动机后仍然启动」，而不是保证「撤掉 AI 后仍然能做题」。前者是自动化，后者是能力，两者需要分开追踪。</p>
        <h3>harness 层的边际价值分布</h3>
        <p>Tutor CoPilot 最值得注意的数字不是整体 +4pp，而是低评级导师的学生 +9pp【13】。AI 增益集中在承接较弱的人力基线，整体被较强的人力基线稀释了。</p>
        <p>这一分布对 agent 工程有直接含义。模型能力越强，harness 的边际价值越小，因为需要兜底的错误空间在收窄。harness 的设计重点因此应该放在护栏失效的场景上，即中等水平 agent 在无人监督时可能直接交出答案的路径，而不是放在把强模型的能力再提升一档上。相应地，对 harness 价值的评估也应当用「撤除后的表现」而不是「任务完成度」。</p>
        <p>前沿模型在 TutorMoments 里的 8 到 14 秒首 token 延迟【15】，在 agent 编排里对应同一类判断：需要即时反馈的环节不能依赖大模型同步生成，延迟本身会改变协作的性质，这与模型能力无关。</p>
        <p>同一章的结论也适用于给 agent 设计激励。给一个 agent 挂上游戏化积分会制造出与 Bain 2025 的 GPT Base 组完全同构的问题：过程指标上升，撤除后下降。需要在任务执行时抑制答案泄漏的护栏，与需要在激励设计里抑制奖励依赖的护栏，是同一个护栏。</p>
        <h2>八、来源与证据强度</h2>
        <p>本报告把来源分为四级。A 级为同行评审一手研究，B 级为预印本、工作论文或预注册审计，C 级为二手财经或行业报道，D 级为内容农场，不采信。</p>
        <p>A 级来源包括 Bloom 1984【1】、von Hippel 2024（<em>Education Next</em> 24(2)）【2】、VanLehn 2011（<em>Educational Psychologist</em> 46(4)）【3】、Kestin 2025（<em>Scientific Reports</em> 15(1):17458）【4】、Bastani 2025（<em>PNAS</em> 122(26)）【5】、Worden 2026（ACM L@S '26 会议论文集）【8】、Ma 2026 的工作论文记录【9】、陈念劬 2023（<em>心理科学进展</em> 31(2)）【19】、Deci、Koestner 与 Ryan 1999（<em>Psychological Bulletin</em> 125(6)）【20】、Sailer 与 Homner 2020（<em>Educational Psychology Review</em> 32(1)）【21】、Zeng 2024（<em>British Journal of Educational Technology</em>）【22】、Gollwitzer 与 Sheeran 2006（<em>Advances in Experimental Social Psychology</em> 38）【25】、Cepeda 等 2006（<em>Psychological Bulletin</em> 132(3)）【26】、TutorMoments 官方发布页【15】与教育部政策原文【27】。</p>
        <p>B 级来源包括台北项目工作论文【6】、StudentBench 预印本【7】、Tutor CoPilot 预印本【13】、Oreopoulos 与 Low 的 NBER 工作论文【11】、Harrison 等人的 Medly 预印本【10】、CS1 课程 RCT 预印本【14】、Favero 等人的立场论文预印本【16】、帮助度与教学法判据的预注册审计【17】、Gyedu 等 2026 的高等教育游戏化元分析【23】、Berridge 实验室的综述文章【18】。</p>
        <p>C 级来源仅用于市场份额、营收与投诉量，不用于任何教学效果主张【28】。NUMI 实验的细节来自研究聚合站的综述，未经一手回溯，本报告只引用其定性结论与平台指标数字【12】。Duolingo 的 A/B 数据属厂商自报，无同行评审与独立审计，本报告只引用其效应方向与量级关系，不作为效果主张【24】。</p>
        <p>不予采信的材料有两类。一类是声称「49 项对照实验的 meta 分析证明 AI 导师超越人类教师」的内容农场文章，理由是它无一手论文链接，且与 Bastani 的 PNAS 结果、Ma 的零结果、StudentBench 作者的自我限定三处直接冲突，同时偷换了「超越课堂教学」与「超越人类 1:1 导师」两个不同命题。另一类是把「可用性」「接受度」「满意度」当作学习效果指标的产品宣传材料。</p>
        <p>本报告有五处已知限制需要明确。其一，第二章提到的 2026 年 meta 分析合并效应量未逐条回溯原始出处。其二，Nickow 等人的辅导 meta 分析，NBER 工作论文版报告 g ≈ 0.37，AERJ 正式发表版修订为 g ≈ 0.29，两值并存，本报告采用后者；其纳入研究数量在不同来源中为 89 项或 96 项，未能统一。其三，Karpicke 与 Roediger 2008 的一周保留率对比（80% 对 36%）来自二手转述，未回溯原文。其四，Sheeran、Listrom 与 Gollwitzer 2024 年的实施意图更新（642 项检验）未回溯原始记录，故其校正后数值不用于承重结论。其五，Cameron 与 Pierce 1994、Eisenberger 与 Cameron 1996、Lally 等 2010、Wood 与 Rünger 2016 在本章中以转述形式出现，未附一手链接，读者引用前应自行核对。</p>
        <p><strong>核心判断</strong>：不要问 AI 有多像人类导师，要问它在人类导师的哪个成分上替代了多少、代价是什么。成分可以拆开单独拿走，而其中体量最大的一块（掌握门控、立即反馈、反复重测）根本不需要 AI；真正需要警惕的是那些在练习环节制造巨大增益、却在撤除辅助后留下净损失的配置，而这类配置恰好是默认设置。同样的判断也适用于动机设计：不要追求对学习上瘾，成瘾的定义就是对自然奖励钝化。要追求的是两个能真实复利的雪球——知识结构本身不断产生下一个信息缺口，以及间隔提取让每次复习越来越便宜。奖励只负责把人送过启动那道门槛，之后应当撤掉，因为按表现给奖的机制正是元分析中侵蚀内在动机最重的那一类。</p>
        <h2>参考文献</h2>
        <p>【1】Bloom, B. S. (1984). The 2 Sigma Problem: The Search for Methods of Group Instruction as Effective as One-to-One Tutoring. <em>Educational Researcher</em>, 13(6), 4–16. <a href="https://doi.org/10.3102/0013189X013006004" target="_blank" rel="noreferrer">https://doi.org/10.3102/0013189X013006004</a></p>
        <p>【2】von Hippel, K. (2024). Two-Sigma Tutoring: Separating Science Fiction from Science Fact. <em>Education Next</em>, 24(2), 22–31. ERIC 记录 EJ1425770. <a href="https://eric.ed.gov/?id=EJ1425770" target="_blank" rel="noreferrer">https://eric.ed.gov/?id=EJ1425770</a></p>
        <p>【3】VanLehn, K. (2011). The Relative Effectiveness of Human Tutoring, Intelligent Tutoring Systems, and Other Tutoring Systems. <em>Educational Psychologist</em>, 46(4), 197–221. <a href="https://eric.ed.gov/?id=EJ946764" target="_blank" rel="noreferrer">https://eric.ed.gov/?id=EJ946764</a></p>
        <p>【4】Kestin, H., et al. (2025). AI tutoring outperforms in-class active learning: an RCT introducing a novel research-based design in an authentic educational setting. <em>Scientific Reports</em>, 15(1), 17458. <a href="https://doi.org/10.1038/s41598-025-97652-6" target="_blank" rel="noreferrer">https://doi.org/10.1038/s41598-025-97652-6</a></p>
        <p>【5】Bastani, H., Bastani, O., Sungu, A., Ge, H., Kabakcı, Ö., &amp; Mariman, R. (2025). Generative AI Can Harm Learning. <em>PNAS</em>, 122(26), e2422633122. <a href="https://doi.org/10.1073/pnas.2422633122" target="_blank" rel="noreferrer">https://doi.org/10.1073/pnas.2422633122</a></p>
        <p>【6】Chung, A. T.-H., Zhang, B., Kung, L.-C., Bastani, H., &amp; Bastani, O. (2026). AI for Python Learning（台北高中 RCT 工作论文）. <a href="https://arxiv.org/abs/2608.16907" target="_blank" rel="noreferrer">https://arxiv.org/abs/2608.16907</a></p>
        <p>【7】Northcutt, C., Hasmani, S., Feng, A., Khangi, F., Plesner, H., &amp; Mueller, R. (2026). StudentBench: Evaluating AI tutors against human tutors（预印本）. <a href="https://arxiv.org/abs/2609.28470" target="_blank" rel="noreferrer">https://arxiv.org/abs/2609.28470</a></p>
        <p>【8】Worden, E., Dang, L., Lim, W. C. I., Miller, S., et al. (2026). A Large Scale Randomized Control Trial Showing LLM Generated Feedback Helps Low-Knowledge Middle School Math Students with Short-Term Learning. <em>Proceedings of the ACM Conference on Learning @ Scale 2026</em>, 361–372. <a href="https://doi.org/10.1145/3774398.3811594" target="_blank" rel="noreferrer">https://doi.org/10.1145/3774398.3811594</a></p>
        <p>【9】Ma, Y., Feng, T., Fairlie, R. W., Liu, C., Loyalka, P., Rozelle, S., &amp; Zhang, X. (2026). Putting AI to the Test: Evidence from a Large-Scale RCT in Rural China. <em>CESifo Working Paper</em> No. 12837. <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7195260" target="_blank" rel="noreferrer">https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7195260</a></p>
        <p>【10】Harrison, W., Khowaja, R., Dobson, E., Uwimpuhwe, G., &amp; Higgins, S. (2026). Evaluating AI Tutoring at the Speed of Innovation: Practitioner-Led Micro-Randomised Trials of an AI Tutoring Platform in GCSE Science（预印本）. <a href="https://arxiv.org/abs/2609.14789" target="_blank" rel="noreferrer">https://arxiv.org/abs/2609.14789</a></p>
        <p>【11】Oreopoulos, P., &amp; Low, N. (2026). 使用 Khanmigo 的补救教学效果（田纳西州 cluster RCT）. <em>NBER Working Paper</em> No. 35620. <a href="https://www.nber.org/papers/w35620" target="_blank" rel="noreferrer">https://www.nber.org/papers/w35620</a></p>
        <p>【12】Making AI Tutoring Productive: Evidence from a Mastery-Based Math Practice Experiment（研究聚合站综述，NUMI 项目）. <a href="https://edtechdev.github.io/aied/articles/making-ai-tutoring-productive-mastery-math-2026" target="_blank" rel="noreferrer">https://edtechdev.github.io/aied/articles/making-ai-tutoring-productive-mastery-math-2026</a></p>
        <p>【13】Wang, R. E., Ribeiro, Robinson, Loeb, S., &amp; Demszky, D. Tutor CoPilot（Tutor CoPilot RCT 预印本）. <a href="https://arxiv.org/abs/2410.03017" target="_blank" rel="noreferrer">https://arxiv.org/abs/2410.03017</a></p>
        <p>【14】Transforming GenAI Policy to Prompting Instruction: An RCT of Scalable Prompting Interventions in a CS1 Course（N = 979，预印本）. <a href="https://arxiv.org/abs/2602.16033" target="_blank" rel="noreferrer">https://arxiv.org/abs/2602.16033</a></p>
        <p>【15】Zhang, A., Ross, A., Patel, K., Bernado, J., Bowie, R., Ribeiro, A. T., Halper, D., Valayaputtur, H., Andreas, J., Loeb, S., Li, L., Lo, K., &amp; Knight, R. TutorMoments-Preview: When Help is Unhelpful — Evaluating AI Tutors for Productive Struggle（Allen Institute for AI 官方发布页）. <a href="https://tutormoments.apps.allenai.org/" target="_blank" rel="noreferrer">https://tutormoments.apps.allenai.org/</a></p>
        <p>【16】Favero, L., Pérez-Ortiz, J. A., Käser, T., &amp; Oliver, N. (2026). From Substitution to Scaffolding: Breaking the Self-Reinforcing Harm Cycle of AI in Education (and Beyond)（立场论文预印本）. <a href="https://arxiv.org/abs/2608.17451" target="_blank" rel="noreferrer">https://arxiv.org/abs/2608.17451</a></p>
        <p>【17】Rethinking LLM-Judged Helpfulness as a Pedagogy Signal（预注册审计，arXiv:2607.28128）. <a href="https://arxiv.org/abs/2607.28128" target="_blank" rel="noreferrer">https://arxiv.org/abs/2607.28128</a></p>
        <p>【18】Smith, A. C., Mahler, M. J., Peciña, A., &amp; Berridge, K. C. (2009). Wanting and Liking: Observations from the Neuroscience and Psychology Laboratory. <em>Philosophical Transactions of the Royal Society B</em>. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2813042/" target="_blank" rel="noreferrer">https://pmc.ncbi.nlm.nih.gov/articles/PMC2813042/</a></p>
        <p>【19】陈念劬（2023）：从好奇发生到满足：好奇反馈循环的神经生理机制，《心理科学进展》31(2): 256–273. <a href="https://journal.psych.ac.cn/xlkxjz/article/2023/1671-3710/1671-3710-31-2-256.shtml" target="_blank" rel="noreferrer">https://journal.psych.ac.cn/xlkxjz/article/2023/1671-3710/1671-3710-31-2-256.shtml</a></p>
        <p>【20】Deci, E. L., Koestner, R., &amp; Ryan, R. M. (1999). A Meta-Analytic Review of Experiments Examining the Effects of Extrinsic Rewards on Intrinsic Motivation. <em>Psychological Bulletin</em>, 125(6), 627–668. <a href="https://doi.org/10.1037/0033-2909.125.6.627" target="_blank" rel="noreferrer">https://doi.org/10.1037/0033-2909.125.6.627</a></p>
        <p>【21】Sailer, M., &amp; Homner, L. (2020). The Gamification of Learning: A Meta-Analysis. <em>Educational Psychology Review</em>, 32(1), 77–112. <a href="https://link.springer.com/article/10.1007/s10648-019-09498-w" target="_blank" rel="noreferrer">https://link.springer.com/article/10.1007/s10648-019-09498-w</a></p>
        <p>【22】Zeng, T., et al. (2024). Exploring the Impact of Gamification on Students' Academic Performance: A Comprehensive Meta-Analysis of Studies from 2008 to 2023. <em>British Journal of Educational Technology</em>. <a href="https://bpspsychub.onlinelibrary.wiley.com/doi/abs/10.1111/bjet.13471" target="_blank" rel="noreferrer">https://bpspsychub.onlinelibrary.wiley.com/doi/abs/10.1111/bjet.13471</a></p>
        <p>【23】Gyedu, F. O., Partey, P. A., Boafo, F. A., &amp; Agbo, D. D. (2026). Gamification Effect: Enhancing Student Learning Outcomes in Higher Education: A Meta-Analysis and Policy Implications. <a href="https://journals.sagepub.com/doi/full/10.1177/21582440261421375" target="_blank" rel="noreferrer">https://journals.sagepub.com/doi/full/10.1177/21582440261421375</a></p>
        <p>【24】Duolingo (2020). How Streaks Keep Duolingo Learners Committed to Their Language Goals（厂商博客，含 Streak Wager 与 Weekend Amulet A/B 结果）. <a href="https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/" target="_blank" rel="noreferrer">https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/</a></p>
        <p>【25】Gollwitzer, P. M., &amp; Sheeran, P. (2006). Implementation Intentions and Goal Achievement: A Meta-analysis of Effects and Processes. <em>Advances in Experimental Social Psychology</em>, 38, 69–119. <a href="https://doi.org/10.1016/S0065-2601(06)38002-1" target="_blank" rel="noreferrer">https://doi.org/10.1016/S0065-2601(06)38002-1</a></p>
        <p>【26】Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., &amp; Rohrer, D. (2006). Distributed Practice in Verbal Recall Tasks: A Review and Quantitative Synthesis. <em>Psychological Bulletin</em>, 132(3), 354–380. <a href="https://doi.org/10.1037/0033-2909.132.3.354" target="_blank" rel="noreferrer">https://doi.org/10.1037/0033-2909.132.3.354</a></p>
        <p>【27】教育部、国家发展改革委、工业和信息化部、科技部、国家数据局：《「人工智能+教育」行动计划》，教科信〔2026〕1 号，2026 年 4 月 2 日. <a href="https://www.gov.cn/zhengce/zhengceku/202604/content_7065138.htm" target="_blank" rel="noreferrer">https://www.gov.cn/zhengce/zhengceku/202604/content_7065138.htm</a></p>
        <p>【28】正观新闻网：《狂揽 10 亿美元营收的学而思学习机，AI 批改、卡顿闪退问题投诉不断》（二手财经报道）. <a href="https://zhengguannews.cn/zghnews/416001.html" target="_blank" rel="noreferrer">https://zhengguannews.cn/zghnews/416001.html</a></p>
      </>
    ),
  },
];

export function getArchivePost(slug: string | undefined): ArchivePost | undefined {
  return ARCHIVE_POSTS.find((post) => post.slug === slug);
}
