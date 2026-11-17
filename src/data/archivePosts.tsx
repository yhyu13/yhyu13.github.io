import type { ReactNode } from "react";

export type ArchivePost = {
  slug:
    | "capsule"
    | "rainbow"
    | "ai-tutor"
    | "scene-3d-pipeline"
    | "stageshow-teardown"
    | "mutation-testing"
    | "ue5-lighting";
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
  {
    slug: "scene-3d-pipeline",
    title: "AI 驱动的 3D 场景生成管线：生态与设计",
    date: "2026-11-07",
    authors: "Hang Yu",
    tags: ["3D", "Agent 工具链"],
    body: (
      <>
        <blockquote><p>调研日期：2026-11-07 调研人：MCode 范围：DCC 侧 agent bridge、资产生成（AIGC）、贴图与光照、引擎侧落地、场景级世界模型</p></blockquote>
        <h2>English rephrase</h2>
        <p>"How do we build a complete AI-driven 3D scene pipeline — starting from a single poster image or one sentence, going through DCC tools (Blender / Unreal) and AIGC generators, and covering lighting, texturing, and engine handoff? Which MCP servers and agent skills actually exist and are still maintained today?"</p>
        <hr />
        <h2>一、结论先行</h2>
        <ol>
        <li>Blocker 已经不存在，问题是选型。Blender 侧目前有两条成熟且<em>互斥</em>的 agent bridge：<code>MCP for Blender</code>（ahujasid，社区事实标准，9 个工具）和 <code>DSH × Blender</code>（sixtysevenlf，15 个工具，带多机位盲审与判定门）。两者都监听 <u>127.0.0.1:9876</u>，只能留一个 [来源: 1-mcpforblender][来源: 1-dshreadme]。</li>
        <li>资产生成层官方 MCP 都存在，但健康度差异很大。<code>Meshy MCP</code> 是这个品类里维护最好的官方选择；<code>Tripo MCP</code>（VAST 官方）自 <u>2025-04-14</u> 起无提交，README 仍写 alpha，PyPI 停在 <u>0.1.2</u>，<u>8</u> 个 issue 未回 —— star 数是历史，不是健康度 [来源: 3-mcpfilm-tripo][来源: 3-mcpso-tripo]。</li>
        <li>贴图与光照这一层已经彻底程序化，不需要额外预算。<code>Poly Haven</code> 提供约 <u>2,400</u> 个 HDRI / 贴图 / 模型，全部 CC0、无需 API key、无账号 [来源: 1-mcpforblender]。<code>MCP for Blender</code> 的 <code>search_assets</code> / <code>import_asset</code> 直接把 HDRI、Principled 材质、<code>.blend</code> 模型拉进场景 [来源: 1-mcpforblender]。</li>
        <li>真正能"一句话→可漫游场景"的是世界模型层。<code>World Labs Marble</code> + World API 接受文本 / 单图 / 多图 / 视频 / 全景 / 粗体块布局，输出持久化 3D 世界，可导出 splat（SPZ / PLY）、碰撞网格 GLB、高质量网格 GLB、360 全景 PNG、相机路径视频 [来源: 3-marble-skill]。但它是<em>静态有界</em>场景，没有烘焙进物理与行为逻辑。</li>
        <li>整条管线的瓶颈不在生成，在验收。<code>DSH × Blender</code> 给出的范式是值得照抄的：把 <code>audit_gate</code> 作为唯一裁决者，<code>doctor → kind=ok</code> 作为唯一安装判据 [来源: 1-dshreadme]。没有机器判定的 gate，AI 自评必然通过。</li>
        <li>本机现状（<u>2026-11-07</u> 实测）：DSH 插件与 Blender addon <em>都还没装</em>；Blender 装的是 <u>5.2</u>，而插件 README 写明「4.2 LTS 为测试版本，5.x 尚未验证」；本机 Node 为 <u>v22.16.0</u>，低于插件源码构建所需的 <u>24.9</u>（npm 安装路径走 DSH 自带运行时，不受影响）。</li>
        </ol>
        <hr />
        <h2>二、事实层：生态分层地图</h2>
        <h3>2.1 DCC 侧 agent bridge（模型 ↔ Blender）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>项目</th>
        <th>关键事实</th>
        <th>维护状态</th>
        <th>来源</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>ahujasid/mcp-for-blender</code></td><td>9 个工具：<code>execute_blender_code</code> / <code>look</code> / <code>get_scene_info</code> / <code>generate_3d</code> / <code>search_assets</code> / <code>import_asset</code> / <code>get_addon_status</code> / <code>disable_telemetry</code> / <code>record_trajectory_feedback</code>。<code>generate_3d</code> 一键接入 Tripo / Hunyuan3D / Hyper3D Rodin / Meshy。端口 9876，支持 safe mode 与多实例端口</td><td>活跃；Windows 有 <code>install.ps1</code> 一键装</td><td>1-mcpforblender</td></tr>
        <tr><td><code>sixtysevenlf/dsh-blender-plugin</code></td><td>15 个工具，含 <code>blender_rt_see/do/watch/worker/headless/job/loop/txn/preset/perf/opt/cmd/plan</code>、<code>blender_viewport</code>。参考图量测、参数化曲面（loft / sweep / 四边片）、装配审计与修复、blockout + turntable、视觉验收门</td><td>活跃；npm 当前 <u>3.0.6</u></td><td>1-dshreadme</td></tr>
        <tr><td><code>dcc-mcp/dcc-mcp-core</code></td><td>一个网关 + CLI 覆盖多个 DCC，带 typed tools 与 Claude Code / Codex agent skills。core <u>53</u> stars，blender <u>45</u>，maya <u>58</u></td><td>2026-10 仍有推送</td><td>3-polywright</td></tr>
        <tr><td><code>yuri-schmaltz/mcp_blender</code></td><td>v2.18.0，含空间工具、local AI 3D generator、Poly Haven / AmbientCG / Sketchfab PBR 接入、产品摄影棚自动布光、视口实时截图、内嵌 WebUI</td><td>活跃</td><td>3-search1</td></tr>
        <tr><td><code>djeada/blender-mcp-server</code></td><td>27 个工具分 7 个命名空间，异步作业不冻结视口，支持 headless</td><td>活跃</td><td>3-search1</td></tr>
        <tr><td><code>zorak1103/blender-mcp</code></td><td>工具面覆盖 Scene / Objects / Materials / Render / Shader / Modifiers / Animation / Lighting / Camera / World / Scripting，HTTP MCP + Bearer token</td><td>活跃</td><td>3-search1</td></tr>
        <tr><td><code>RobLe3/cc-blender-skill</code></td><td>29 个 Claude Code skill：路由、text-to-blender、建模、材质、灯光、导出、参考图重建、多视图拟合循环、质量精修自循环</td><td>依赖 blender-mcp 占用 9876</td><td>3-polywright</td></tr>
        <tr><td>Blender 官方 <code>blender.org/lab/mcp-server</code></td><td>Blender 基金会自有的 MCP server</td><td>官方</td><td>3-polywright</td></tr>
        </tbody>
        </table>
        </div>
        <h3>2.2 引擎侧</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>项目</th>
        <th>关键事实</th>
        <th>来源</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>ChiR24/Unreal_mcp</code></td><td>用 Geometry Script 管几何：primitives / booleans / extrude / Nanite。<u>916</u> stars</td><td>3-polywright</td></tr>
        <tr><td>Unreal 官方 MCP</td><td>随 UE <u>5.8</u> 出货；UEFN 于 <u>2026-08-20</u> 上线</td><td>3-polywright</td></tr>
        <tr><td><code>CoplayDev/unity-mcp</code></td><td>Unity Package Manager 从 git URL 安装，TS → 6.x，面向 Claude Desktop / Code / Cursor / VS Code / Windsurf / Cline / Gemini CLI</td><td>3-search2</td></tr>
        <tr><td><code>Coding-Solo/godot-mcp</code></td><td>Godot 侧最流行，<u>5,948</u> stars，可修脚本、读报错、跑游戏、用截图验证输出</td><td>3-search2</td></tr>
        <tr><td><code>capoomgit/houdini-mcp</code></td><td>节点 / 参数 / Python</td><td>3-polywright</td></tr>
        <tr><td><code>neka-nat/freecad-mcp</code> · <code>RobertCoop/openscad-mcp</code> · <code>cl0nazepamm/3dsmax-mcp</code> · Maya MCP 三家</td><td>CAD / DCC 侧补充</td><td>3-polywright</td></tr>
        </tbody>
        </table>
        </div>
        <h3>2.3 资产生成（AIGC）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>项目</th>
        <th>关键事实</th>
        <th>来源</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>Tripo</td><td>官方 MCP（<code>uvx tripo-mcp</code>）+ Python SDK（PyPI <code>tripo3d</code>）+ 官方 Blender 扩展 <code>tripo-3d-for-blender</code>。价格 <u>1 credit = $0.01</u>；text-to-3D <u>10–20</u> credits，image-to-3D <u>20–30</u>；附加项 HD 贴图 +10、8K 贴图 +20、HD 几何 +20、quad mesh +5</td><td>3-mcpfilm-tripo · 3-agentgid</td></tr>
        <tr><td>Tripo MCP 健康度</td><td>最后提交 <u>2025-04-14</u>，PyPI <u>0.1.2</u>，README 仍写 alpha，<u>8</u> 个 issue 未回。社区策展明确写「把 star 当历史，不要当健康度」</td><td>3-mcpfilm-tripo</td></tr>
        <tr><td>Meshy</td><td>官方 MCP + <code>meshy-3d-agent</code> skills：文本 / 图 / 多图 → 3D，remesh、retexture、rig、animate、送切片器。MCP <u>50</u> stars，skills <u>98</u> stars，2026-10 有推送 —— 同品类里维护最好</td><td>3-polywright</td></tr>
        <tr><td>Hunyuan3D</td><td>腾讯云官方 API，国内 <code>ai3d</code> / 国际 <code>hunyuan</code> 两套端点；PBR 可选</td><td>1-mcpforblender</td></tr>
        <tr><td>Hyper3D Rodin</td><td>MCP for Blender 内建接入</td><td>1-mcpforblender</td></tr>
        <tr><td>TRELLIS.2</td><td>Microsoft 开源，<u>11,849</u> stars，ComfyUI 原生</td><td>3-polywright</td></tr>
        <tr><td>Meshwright（seena18）</td><td>LangGraph 管线 + MCP + CLI：prompt → 参考图 → TRELLIS.2 → GLB，每步带视觉复审，Blender 四视图 turntable + 网格统计，异步作业工具</td><td>3-polywright</td></tr>
        <tr><td>ShapeWright</td><td>Python CLI + MCP，<u>18</u> 个工具，基于 build123d / OCP</td><td>3-polywright</td></tr>
        </tbody>
        </table>
        </div>
        <h3>2.4 贴图与光照（可程序化，无需额外预算）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>来源</th>
        <th>关键事实</th>
        <th>来源</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>Poly Haven</td><td>约 <u>2,400</u> 个 HDRI / 贴图 / 模型，全部 CC0，捐赠资助，无 API key、无账号。导入时把 <code>polyhaven_id / url / authors / resolution / licence</code> 写成自定义属性留在 <code>.blend</code> 里</td><td>1-mcpforblender</td></tr>
        <tr><td>Sketchfab / Poly Pizza</td><td>Sketchfab 模型；Poly Pizza 约 <u>10,600</u> 个免费低模（含 Google Poly 存档），但约 <u>69 %</u> 是 CC-BY，需要署名。<code>static.poly.pizza</code> 有 Cloudflare 挡机房 / VPN IP</td><td>1-mcpforblender</td></tr>
        <tr><td>Meshy retexture</td><td>官方 MCP 内建重贴图能力</td><td>3-polywright</td></tr>
        <tr><td>AmbientCG</td><td><code>mcp_blender</code> 内建 PBR provider</td><td>3-search1</td></tr>
        </tbody>
        </table>
        </div>
        <h3>2.5 场景级（世界模型）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>项目</th>
        <th>关键事实</th>
        <th>来源</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>World Labs Marble</td><td>多模态世界模型，GA <u>2025-11-12</u>，World API 公告 <u>2026-01-21</u>。输入模式：文本 / 单图 / 多图（最多 4 张，API 重建模式最多 8 张）/ 视频（≤100 MB）/ 360 全景 / 粗体块布局</td><td>3-marble-skill</td></tr>
        <tr><td>Chisel</td><td>Marble 的粗体块工具，把结构与风格解耦：box / plane / wall / extrude，可导入 GLB / FBX 当体块，摆放全景相机</td><td>3-marble-skill</td></tr>
        <tr><td>导出格式</td><td>SPZ（Marble 原生 splat）/ PLY（通用 splat）/ 碰撞网格 GLB（约 <u>100–200k</u> 三角，<u>3–4 MB</u>）/ 高质量网格 GLB（约 <u>600k</u> 三角带贴图，或约 <u>1M</u> 顶点着色，<u>100–200 MB</u>）/ 360 全景 PNG / 相机路径视频</td><td>3-marble-skill</td></tr>
        <tr><td>成本</td><td>App 档位 Free 约 4 次 / Standard 约 $20 约 12 次 / Pro 约 $35 约 25 次 / Max 约 $95 约 75 次（每月）。API 单独钱包，<u>$1.00 / 1,250 credits</u>，起充 <u>$5</u>。draft 约 150–250 credits（<u>约 $0.12–0.20</u>），1.0 / 1.1 约 <u>1,500–1,600</u> credits（<u>约 $1.20</u>），1.1 Plus 按体积涨到约 <u>3,000</u></td><td>3-marble-skill</td></tr>
        <tr><td>权利</td><td>Free 档输出 World Labs 保留权利、仅个人非商用。商用需 Pro / Max，或付费 API 权益。<strong>App 积分与 API 积分是两个钱包，不能互花</strong></td><td>3-marble-skill</td></tr>
        <tr><td>坑</td><td>导出默认 OpenCV 坐标系，OpenGL 侧要把 Y 与 Z 乘 −1，否则场景上下颠倒。薄结构 / 透明 / 反射面重建伪影多。高质量网格耗时最长约 <u>1 小时</u>，限流约 <u>4 次/小时</u>，仅 Pro 档</td><td>3-marble-skill</td></tr>
        <tr><td>Genie 3</td><td>DeepMind，<u>20–24 fps</u> @720p，可实时导航；官方自述动作空间有限、连续交互仅几分钟</td><td>3-elseland</td></tr>
        <tr><td>NVIDIA Cosmos</td><td>世界基础模型，下载量超 <u>200 万</u> 次</td><td>3-algoryte</td></tr>
        </tbody>
        </table>
        </div>
        <h3>2.6 本机已有资产（grounding，非网络信息）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>资产</th>
        <th>位置</th>
        <th>状态</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>ai-3d-scene-pipeline</code></td><td><code>C:\Git-repo-AI\4_Skill\AgentSkillsVault\SKILL\game-dev\</code></td><td>已有。链路是：概念参考图 → 资产拆解分流 → Tripo 生成 → Blender/Unity 组装 → 多机位盲审迭代</td></tr>
        <tr><td><code>ai-3d-character-pipeline</code> · <code>blender-game-assets-v2</code> · <code>procedural-3d-scenes</code> · <code>three-procedural-scenes</code></td><td>同上</td><td>已有</td></tr>
        <tr><td><code>tripo-3d-generation</code></td><td>—</td><td><em>不存在</em>。但 <code>ai-3d-scene-pipeline</code> 正文写着「批量生成用 API（见已装 skill <code>tripo-3d-generation</code>）」—— 这是一条失效引用</td></tr>
        </tbody>
        </table>
        </div>
        <hr />
        <h2>三、[判断与建议]</h2>
        <p>以下为判断，不是已核实事实。</p>
        <h3>3.1 推荐主架构</h3>
        <p>以 <code>DSH × Blender</code> 作为 DCC 侧 agent bridge，理由是它把<em>验收</em>做进了一等公民，而这正是当前所有公开方案里最稀缺的一环。<code>MCP for Blender</code> 的 <code>generate_3d</code> / <code>search_assets</code> / <code>import_asset</code> 三件套更成熟（Poly Haven + Tripo + Meshy + Rodin + Hunyuan3D 一个入口），可作为资产层补充——但两者抢同一个 9876 端口，不能并存。</p>
        <p>如果不想依赖 DSH，另一条等效路线是 <code>MCP for Blender</code> + 自己写 <code>blender_rt_see/audit_*</code> 等价的验收脚本。代价是要自建盲审闭环，工作量比装 DSH 插件大一个量级。</p>
        <h3>3.2 关于 Tripo 怎么接</h3>
        <p>Tripo 的 <em>API</em> 是活 的（SDK 2026-10 仍有推送），死的是官方 <em>MCP 包装</em>。所以更稳的接法是：不用 <code>tripo-mcp</code>，直接用 <code>tripo3d</code> Python SDK 或 <code>tripo-cli</code>（npm），在管线里当一个命令行步骤调用，产出 GLB 交给 Blender 导入。这样绕开了那个 18 个月没动的 alpha 包，同时保留 Tripo 的生成质量和价格优势。</p>
        <h3>3.3 三档落地路径</h3>
        <ul>
        <li><em>最省事</em>：先只装 DSH 插件 + addon，用它的 headless 作业区把「参考图 → 装配 → 判定」这条主干跑通，资产先用 Poly Haven + 参数化搭建，不接任何付费生成。</li>
        <li><em>中等</em>：主干跑通后接 Tripo SDK 只做有机/雕塑感道具，规则几何仍用代码搭。</li>
        <li><em>最远</em>：接 Marble World API 做场景底稿，用 Blender 修结构、补光照、贴图，再进引擎。</li>
        </ul>
        <h3>3.4 三个必须先解决的现实问题</h3>
        <ol>
        <li><em>端口独占</em>：DSH Blender Bridge 与 MCP for Blender 都占 <u>127.0.0.1:9876</u>。同时装会互相抢，表现是「时好时坏」。必须二选一。</li>
        <li><em>Blender 版本</em>：本机是 <u>5.2</u>，插件 README 明确「4.2 LTS 为测试版本，5.x 尚未验证」。要么装 <u>4.2 LTS</u> 并等插件验证 5.x，要么接受首跑可能踩 addon API 变更。</li>
        <li><em>Node 版本</em>：本机 <u>v22.16.0</u>，插件源码构建要求 <u>≥ 24.9</u>。走 npm 安装路径不受影响（用 DSH 自带运行时），但如果要本地改插件源码，得先升 Node。</li>
        </ol>
        <hr />
        <h2>四、表格总结</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>选项</th>
        <th>代价</th>
        <th>影响</th>
        <th>ROI</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>我1：只装 DSH 插件 + addon，跑通「参考图→装配→判定」主干</td><td>装插件约 <u>30–60 分钟</u>（估算，含重启 DSH 与 doctor 校验）；需降级 Blender 或接受 5.2 未验证</td><td>拿到完整验收闭环，资产先靠 Poly Haven + 参数化搭建；生成质量暂不追求</td><td>投入 1 人时 → 产出可复用管线主干 → 回收周期 <u>当次任务内</u>（估算）</td></tr>
        <tr><td>我2：主干之上接 Tripo SDK 做有机道具</td><td>需申请 API key；单资产 <u>10–30 credits</u>（<u>约 $0.10–0.30</u>）；布线约 <u>2–4 小时</u>（估算）</td><td>有机/雕塑感资产质量到位，拓扑仍需 Blender 侧清理</td><td>投入约 <u>$0.30–1.20</u> + <u>2–4 小时</u> → 产出场景道具库 → 回收周期 <u>首个客户场景</u>（估算）</td></tr>
        <tr><td>你1：接 Marble World API 做场景底稿</td><td>商用需 Pro 档约 <u>$35/月</u>；单世界 draft 约 <u>$0.12–0.20</u>、1.1 约 <u>$1.20</u>；高质量网格限 <u>4 次/小时</u></td><td>「一句话→可漫游场景」成立，但拿到的是静态有界世界，物理与行为逻辑仍需在引擎里补</td><td>投入约 <u>$1.20</u>/世界 + 修整工时 → 产出可进引擎的场景底稿 → 回收周期 <u>每场景一次</u>（估算）</td></tr>
        <tr><td>你2：全链路（Marble 底稿 + Tripo 道具 + Blender 精修 + 引擎落地 + 盲审）</td><td>首条链路搭建约 <u>1–2 周</u>（估算）；月度生成成本约 <u>$5–40</u>（估算）；场景数量受限</td><td>唯一能同时满足「一句话/海报 → 生产可用 3D 场景」的路子，但依赖多、任一环掉链子就断</td><td>投入 <u>1–2 周</u> + 月度 <u>$5–40</u> → 产出可交付场景流水线 → 回收周期 <u>第 2 条场景起</u>（估算）</td></tr>
        </tbody>
        </table>
        </div>
        <hr />
        <h2>五、来源清单</h2>
        <p><strong>一手（项目官方仓库 / 官方文档，本轮直接抓取）</strong></p>
        <ul>
        <li>[1-mcpforblender] <code>ahujasid/mcp-for-blender</code> README — <a href="https://github.com/ahujasid/mcp-for-blender" target="_blank" rel="noreferrer">https://github.com/ahujasid/mcp-for-blender</a></li>
        <li>[1-dshreadme] <code>sixtysevenlf/dsh-blender-plugin</code> README — <a href="https://github.com/sixtysevenlf/dsh-blender-plugin" target="_blank" rel="noreferrer">https://github.com/sixtysevenlf/dsh-blender-plugin</a></li>
        </ul>
        <p><strong>策展目录 / 社区汇总（仅供参考，已在正文标注）</strong></p>
        <ul>
        <li>[3-mcpfilm-tripo] mcp.film Tripo MCP 条目（策展核实于 2026-10-16）— <a href="https://mcp.film/mcps/tripo" target="_blank" rel="noreferrer">https://mcp.film/mcps/tripo</a></li>
        <li>[3-mcpso-tripo] MCP Servers / Tripo MCP Server 条目 — <a href="https://mcp.so/servers/tripo-mcp" target="_blank" rel="noreferrer">https://mcp.so/servers/tripo-mcp</a></li>
        <li>[3-agentgid] agentgid Tripo API 定价页（核对于 2026-10-09）— <a href="https://agentgid.com/apis/tripo" target="_blank" rel="noreferrer">https://agentgid.com/apis/tripo</a></li>
        <li>[3-marble-skill] 社区整理的 World Labs Marble skill（逐条标注一手出处与核实日期）— <a href="https://github.com/calesthio/generative-media-skills/blob/HEAD/skills/providers/world-models/world-labs-marble/SKILL.md" target="_blank" rel="noreferrer">https://github.com/calesthio/generative-media-skills/blob/HEAD/skills/providers/world-models/world-labs-marble/SKILL.md</a></li>
        <li>[3-polywright] <code>m4bwav/polywright</code> AI-agents-and-3d 调研（GitHub 数据采集于 2026-10-11）— <a href="https://github.com/m4bwav/polywright/blob/main/ai-docs/research/2026-10-11-ai-agents-and-3d.md" target="_blank" rel="noreferrer">https://github.com/m4bwav/polywright/blob/main/ai-docs/research/2026-10-11-ai-agents-and-3d.md</a></li>
        <li>[3-search1] / [3-search2] / [3-elseland] / [3-algoryte] — 本轮检索返回的社区文章与目录页</li>
        </ul>
        <p><strong>本机实测</strong></p>
        <ul>
        <li>Blender 安装目录、<code>.dsh\profiles\desktop\package.json</code>、Blender 5.2 用户扩展目录、<code>node -v</code>、三个 DASH 音轨的波形与 ASR 结果</li>
        </ul>
        <hr />
        <p>免责声明：本输出由 AI 辅助生成，仅用于信息整理与研究参考，不构成专业意见或决策依据。</p>
        <h2>一句话 / 一张海报 → 完整 3D 场景 · 管线设计</h2>
        <blockquote><p>版本：v1.0 · 2026-11-07 目标：把「从海报或一句话，用 DCC 工具和 AIGC 工具，生成整个 3D 场景」变成一条<em>可重复、可验收、可交付</em>的链路，而不是一次性 demo。 配套调研：<code>3D场景生成生态调研.md</code></p></blockquote>
        <h2>English rephrase</h2>
        <p>"Design a complete, repeatable 3D scene pipeline: from a poster image or one sentence, through reference normalization, asset triage, generative asset production, scene assembly, texturing, lighting, blind multi-view validation, and engine handoff — with machine-checkable gates at every stage."</p>
        <hr />
        <h2>零、一句话架构</h2>
        <blockquote><p>参考层 → 分流层 → 资产层 → 场景层 → 表现层 → 验收层 → 交付层</p></blockquote>
        <p>每层只有一个职责，每层只有一个产出物，每层只有一个机器判据。判据不过就退回上一层，不许带着问题往下走。</p>
        <hr />
        <h2>一、输入契约：把海报和一句话拉平成同一种输入</h2>
        <p>两种入口最终必须收敛到同一份<strong>统一中间表示</strong> <code>scene-spec.yaml</code> + 一组参考图。</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>入口</th>
        <th>归一化步骤</th>
        <th>产出</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>一句话</td><td>文本 → 场景类型 / 主体 / 时代 / 情绪 / 光照假设 → 反推主视角描述</td><td>参考图集（至少 3 张）+ <code>scene-spec.yaml</code> 草稿</td></tr>
        <tr><td>一张海报</td><td>海报 → 分割出主体 / 背景 / 光源方向 → 色彩与材质采样 → 重建缺失角度</td><td>参考图集（至少 3 张）+ <code>scene-spec.yaml</code> 草稿</td></tr>
        </tbody>
        </table>
        </div>
        <p><code>scene-spec.yaml</code> 的最小字段（这是整条管线的"契约"，缺字段就补图不补猜）：</p>
        <pre data-lang="yaml"><code>scene_id: &lt;slug&gt;
        intent: &lt;一句话意图，原样保留，不改写&gt;
        layout:                     # 平面布局，单位米
          - &#123; name: floor,   type: plane,  size: [12, 12], origin: [0, 0, 0] &#125;
          - &#123; name: wall_n,  type: wall,   size: [12, 3.2], origin: [0, 6, 1.6] &#125;
        props:                      # 资产清单，含分流结论
          - name: statue_01
            brief: "风化石雕像，高 2.4m，躯干有横向裂纹"
            route: generate         # generate | parametric | library
            generator: tripo        # tripo | meshy | trellis | none
            ref_images: [ref/front.png, ref/side.png]
            size_hint: [0.9, 0.9, 2.4]
            material_intent: "风化石灰，无涂装，中等粗糙度"
        lighting:
          key:   &#123; kind: hdri, source: polyhaven, query: "overcast afternoon" &#125;
          fill:  &#123; kind: area,  energy: 120, size: 3.0 &#125;
          world: &#123; hdri_intensity: 0.6, exposure: 0.0 &#125;
        camera:
          views: [ &#123; name: iso,   type: ortho, azimuth: 45,  elevation: 35 &#125;,
                   &#123; name: front, type: ortho, azimuth: 0,   elevation: 0  &#125;,
                   &#123; name: right, type: ortho, azimuth: 90,  elevation: 0  &#125; ]</code></pre>
        <p>约定三条：</p>
        <ol>
        <li><em>场景结构用数字表达，不用形容词表达</em>。灯光写 HDRI 查询词，材质写"风化石灰、中等粗糙度"，不写"好看的石头"。</li>
        <li><em>每条 prop 必须带 <code>route</code> 字段</em>，不填不允许进入资产层。</li>
        <li><em>相机位在 spec 里先定死</em>。后面对比参考图时同机位对比，否则盲审无效。</li>
        </ol>
        <hr />
        <h2>二、管线总览</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>#</th>
        <th>阶段</th>
        <th>产出物</th>
        <th>机器判据（gate）</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>0</td><td>输入归一化</td><td><code>scene-spec.yaml</code> + 参考图集</td><td>参考图 ≥ <u>3</u> 张且视角互不重复；spec 字段无空缺</td></tr>
        <tr><td>1</td><td>资产分流</td><td>带 <code>route</code> 标注的 spec</td><td>每条 prop 都有 route；可参数化项 ≥ <u>50 %</u>（估算阈值，可调）</td></tr>
        <tr><td>2</td><td>资产生成</td><td><code>&lt;name&gt;.glb</code> 集合</td><td>每个资产存在、面数与尺寸在区间内、无非流形</td></tr>
        <tr><td>3</td><td>场景搭建</td><td><code>scene.blend</code></td><td><code>audit_connectivity</code> 通过；<code>audit_interference</code> 无遮挡</td></tr>
        <tr><td>4</td><td>贴图</td><td>Principled 材质 + 贴图集</td><td>每个 mesh 材质非空；贴图全部来自可署名来源</td></tr>
        <tr><td>5</td><td>光照</td><td>World + 灯组</td><td>三机位渲染亮度方差在目标区间</td></tr>
        <tr><td>6</td><td>盲审</td><td>差异清单</td><td>差异清单为空，或剩余差异被显式接受并记录</td></tr>
        <tr><td>7</td><td>交付</td><td>GLB / FBX + manifest</td><td>引擎内可加载；manifest 与 spec 一致</td></tr>
        </tbody>
        </table>
        </div>
        <hr />
        <h2>三、逐阶段规格</h2>
        <h3>阶段 0 · 输入归一化</h3>
        <p><em>做什么</em>：把海报或一句话变成参考图集 + spec 草稿。</p>
        <ul>
        <li>一句话入口：用图像模型按 spec 的三个相机位各出一张参考图（iso / front / right）。这一步是<strong>最容易被跳过也最值钱</strong>的一步——没有多视角，后面全是猜。</li>
        <li>海报入口：先分割海报，提取主体轮廓与光源方向；再补两个缺失角度的反推图。</li>
        <li>一致性检查：三张参考图里服装 / 比例 / 配色必须一致。不一致就重出，不要硬着头皮往下走。</li>
        </ul>
        <p><em>判据</em>：三视角参考图存在；同一元素的横向像素占比在三图之间偏差 ≤ <u>10 %</u>（估算，可调）。</p>
        <h3>阶段 1 · 资产分流（最值钱的一步）</h3>
        <p>核心判据一句话：<em>这个形状能被参数化描述吗？能 → 代码；不能 → 生成。</em></p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>资产类型</th>
        <th>route</th>
        <th>工具</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>墙 / 台阶 / 箱 / 路 / 柱 / 栏杆等规则几何</td><td><code>parametric</code></td><td>Blender <code>bpy</code> 脚本、阵列 / 布尔 / 挤出</td></tr>
        <tr><td>有机、雕塑感、纹理复杂（雕像、异形植物、软装）</td><td><code>generate</code></td><td>Tripo / Meshy / TRELLIS.2</td></tr>
        <tr><td>通用家具 / 道具 / 植被</td><td><code>library</code></td><td>Poly Haven / Sketchfab / Poly Pizza</td></tr>
        <tr><td>角色</td><td><code>generate</code> + 单独绑定</td><td>见 <code>ai-3d-character-pipeline</code></td></tr>
        </tbody>
        </table>
        </div>
        <p><em>为什么必须分流</em>：全丢给生成模型，拓扑不可控、风格不统一、且每个资产都花钱。全用代码搭，有机形状做不出来。</p>
        <p><em>判据</em>：spec 里每条 prop 的 route 非空；<code>parametric</code> 项占比达标；每条 <code>generate</code> 项有 ≤ <u>2</u> 张参考图与一句 <code>brief</code>。</p>
        <h3>阶段 2 · 资产生成</h3>
        <p>推荐接法：<strong>绕开官方 MCP 包，直接用 API / SDK</strong>，因为 Tripo 官方 MCP 自 <u>2025-04</u> 起无提交。</p>
        <pre data-lang="bash"><code># Tripo：文本 → GLB（官方 Python SDK，PyPI: tripo3d）
        python -c "from tripo3d.client import Client; ..."
        # 或 npm: tripo-cli

        # Meshy：官方 MCP（这层维护最好）
        # TRELLIS.2：本地跑，适合要隐私或大批量的批量道具</code></pre>
        <p><em>判据</em>：资产 GLB 落盘；三角面数落在 <code>[min, max]</code> 区间（按 <code>size_hint</code> 估）；包围盒尺寸与 <code>size_hint</code> 偏差 ≤ <u>15 %</u>（估算）；无非流形边。</p>
        <p><em>失败处理</em>：生成结果不合格时，<strong>优先改 brief 而不是换生成器</strong>。Tripo 支持 text / single image / multiview（front / left / right / back）三种输入——有参考图就一定用 multiview，不要只靠文本。</p>
        <h3>阶段 3 · 场景搭建</h3>
        <ul>
        <li>全部用脚本搭建，重复摆放用阵列 / 复制，材质分配用批量接口。手点的东西不进入管线。</li>
        <li>结构清理（减面、法线、重拓扑）在这里做完，引擎侧只做场景与交互。</li>
        <li>用 DSH × Blender 的 <code>blender_rt_do</code>（持久 Python kernel）执行，<strong>不要</strong>用一次性 <code>blender -b</code> 脚本跑完就散——持久 kernel 才能增量迭代。</li>
        </ul>
        <p><em>判据</em>：<code>audit_connectivity</code> 通过（<u>0</u> 错误）；<code>audit_interference</code> 无遮挡（<u>0 mm³</u>）；同机位渲染与参考图比对，构件位置偏差在容差内。</p>
        <h3>阶段 4 · 贴图</h3>
        <ul>
        <li>底子用 <code>Poly Haven</code>（CC0，无需 key）：<code>search_assets(source="polyhaven", query=..., asset_type="textures")</code> → <code>import_asset(...)</code>。导入时把来源写进自定义属性，署名问题在源头解决。</li>
        <li>生成的资产自带贴图不够时，用 Meshy 的 <code>retexture</code>，或本地跑生成式贴图模型。</li>
        <li>每个 mesh 必须有非空材质；纯默认灰材质视为未完成。</li>
        </ul>
        <p><em>判据</em>：mesh 材质槽非空；贴图来源可追溯（写进 manifest）；贴图分辨率 ≤ <u>2K</u>（除非近景特写，否则 ≤ <u>1K</u>——文件大小每档翻 <u>4</u> 倍）。</p>
        <h3>阶段 5 · 光照</h3>
        <p>三件套，按顺序：</p>
        <ol>
        <li><em>环境</em>：Poly Haven HDRI 打底，<code>world</code> 强度可调，HDRI 打包进 <code>.blend</code>（保存后仍有效）。</li>
        <li><em>主光</em>：按 spec 的 <code>key</code>，用 area light 或 sun，对齐参考图的光源方向。</li>
        <li><em>补光 / 轮廓光</em>：单侧场景必须补，否则渲染发闷。</li>
        </ol>
        <p><em>判据</em>：三个机位渲染图的亮度均值落在参考图 ±<u>15 %</u>（估算）；直方图不出现大面积死黑或过曝。</p>
        <h3>阶段 6 · 盲审（质量闸，不可省）</h3>
        <p>这是整条链路的价值所在，也是最容易被跳过的一步。</p>
        <p>规则：</p>
        <ul>
        <li>审查方<em>独立于</em>实现方，不共享实现过程，只拿<strong>渲染图 vs 参考图</strong>。</li>
        <li>逐机位、逐角度找差异，不做整体印象打分。</li>
        <li>差异清单为空（或剩余差异被显式接受并记录）才算过。</li>
        </ul>
        <p>实操上，DSH × Blender 已经把这条做成了工具链：<code>ac_render_views</code>（iso / front / right）+ <code>audit_gate</code>（<code>ok=true</code>）+ <code>blender_rt_txn</code>（快照回滚）+ 轨迹回溯。直接用，不要自己重造。</p>
        <p><em>判据</em>：<code>audit_gate</code> 返回 <code>ok=true</code> 且失败数 <u>0</u>；差异清单为空或已签字接受。</p>
        <h3>阶段 7 · 交付</h3>
        <ul>
        <li>导出 GLB（通用）/ FBX（引擎）/ OBJ（老管线），同时输出 <code>manifest.json</code>：每个资产来源、生成器、模型版本、prompt、参考图、变换、授权、日期、审查人、用途。</li>
        <li>引擎内也要截一次图复核——只看 Blender 会漏掉引擎里的穿帮与光照差异。</li>
        </ul>
        <p><em>判据</em>：引擎内可加载并走通；引擎内截图与 Blender 渲染无明显差异；manifest 覆盖全部资产。</p>
        <hr />
        <h2>四、工具与端口配置</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>角色</th>
        <th>选型</th>
        <th>端口</th>
        <th>备注</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>DCC 侧 agent bridge</td><td><code>DSH × Blender</code>（sixtysevenlf）</td><td>addon <u>9876</u> / host <u>9877</u></td><td>自带验收门与盲审工具</td></tr>
        <tr><td><em>互斥备选</em></td><td><code>MCP for Blender</code>（ahujasid）</td><td><u>9876</u></td><td>资产工具面更成熟；<strong>不能与上行并存</strong></td></tr>
        <tr><td>资产生成</td><td>Tripo API / Meshy MCP / TRELLIS.2</td><td>—</td><td>建议直接调 API，不走官方 MCP 包</td></tr>
        <tr><td>贴图 / HDRI</td><td>Poly Haven（CC0）</td><td>—</td><td>无 key、无账号</td></tr>
        <tr><td>几何库</td><td>Poly Pizza / Sketchfab</td><td>—</td><td>注意 CC-BY 署名</td></tr>
        <tr><td>场景底稿（可选）</td><td>Marble World API</td><td>—</td><td>商用需 Pro 档</td></tr>
        </tbody>
        </table>
        </div>
        <p>端口约束：<code>127.0.0.1:9876</code> 只能被一个 agent bridge 占用。同时装 DSH Blender Bridge 与 MCP for Blender 的表现是"时好时坏"，不是稳定报错——这是最难查的一类问题。</p>
        <hr />
        <h2>五、本机落地步骤</h2>
        <p>按顺序，每步都有可判定的检查点：</p>
        <ol>
        <li><em>解 Blender 版本</em>。本机是 <u>5.2</u>，插件 README 写明 4.2 LTS 是测试版本、5.x 未验证。先决定：装 <u>4.2 LTS</u>，还是接受 5.2 首发踩坑。</li>
        <li><em>装 addon</em>。下载 <code>dsh_blender_bridge.zip</code>（GitHub Release），Blender → Edit → Preferences → Add-ons → Install → 启用 <strong>DSH Blender Bridge</strong> → 3D 视图按 <u>N</u> 打开侧栏 → Connect。</li>
        <li><em>装 DSH 插件</em>。<code>dsh plugin --profile &lt;profile&gt; add dsh-blender-plugin@3.0.6</code>（DSH Desktop 走 Plugins 页面，装完不用重启；DSH Web / TUI 需要重启）。</li>
        <li><em>验收</em>。<code>curl -sS <a href="http://127.0.0.1:9877/doctor" target="_blank" rel="noreferrer">http://127.0.0.1:9877/doctor</a></code>，<code>kind</code> 必须等于 <code>ok</code>。<strong>这一条不过就不要往下走。</strong></li>
        <li><em>无 GUI 降级</em>。<code>blender_rt_worker(op="start")</code> → <code>op="see"</code> 必须回一帧。</li>
        <li><em>跑通最小场景</em>。用阶段 0 的一张参考图 + 一个 parametric 资产 + 一张 Poly Haven 贴图 + 一个 HDRI，跑完阶段 3–6 的判据。</li>
        <li><em>再接生成</em>。先 Tripo 单个资产（成本约 <u>$0.10–0.30</u>），跑通再批量。</li>
        </ol>
        <p>升级期的两个已知坑（来自视频原文）：addon 升级后要在 Add-ons 里重新勾选一次；插件升级后必须重启 DSH。</p>
        <hr />
        <h2>六、成本与时间模型（估算）</h2>
        <p>单场景，假设参考图已就绪、资产 <u>12</u> 件：</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>阶段</th>
        <th>时间（估算）</th>
        <th>直接成本（估算）</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>0 输入归一化</td><td><u>15–30 分钟</u></td><td><u>$0</u>（图像生成可复用现有额度）</td></tr>
        <tr><td>1 资产分流</td><td><u>10–20 分钟</u></td><td><u>$0</u></td></tr>
        <tr><td>2 资产生成</td><td><u>3–6 分钟/件</u></td><td>Tripo <u>$0.10–0.30</u>/件 → 约 <u>$1.20–3.60</u></td></tr>
        <tr><td>3 场景搭建</td><td><u>30–60 分钟</u></td><td><u>$0</u></td></tr>
        <tr><td>4 贴图</td><td><u>15–30 分钟</u></td><td><u>$0</u>（Poly Haven 全 CC0）</td></tr>
        <tr><td>5 光照</td><td><u>15–30 分钟</u></td><td><u>$0</u></td></tr>
        <tr><td>6 盲审迭代</td><td><u>20–40 分钟</u> × 迭代轮次</td><td><u>$0</u></td></tr>
        <tr><td>7 交付</td><td><u>10–20 分钟</u></td><td><u>$0</u></td></tr>
        </tbody>
        </table>
        </div>
        <p>单场景合计：约 <u>2–4 小时</u>（估算），直接生成成本约 <u>$1.20–3.60</u>（估算）。如果底稿走 Marble World API，另加约 <u>$1.20</u>/世界（draft 约 <u>$0.12–0.20</u>）。</p>
        <hr />
        <h2>七、表格总结</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>选项</th>
        <th>代价</th>
        <th>影响</th>
        <th>ROI</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>我1：只跑阶段 0/1/3/4/5/7（零生成，全代码 + Poly Haven）</td><td>单场景约 <u>1.5–3 小时</u>（估算），成本 <u>$0</u></td><td>只对规则几何场景成立；有机资产做不出来，但验收闭环与工具链全部验证过</td><td>投入 <u>1 人时</u> 起 → 产出验证过的管线主干 → 回收周期 <u>当次任务内</u>（估算）</td></tr>
        <tr><td>我2：主干 + Tripo SDK 接单个有机资产</td><td>约 <u>3–6 分钟</u>/件 + <u>$0.10–0.30</u>/件（估算）；API key 申请与接线 <u>2–4 小时</u>（一次性）</td><td>有机资产可用，场景完整度显著上升</td><td>投入 <u>2–4 小时</u> 一次性 + <u>$0.30</u> → 产出可交付场景 → 回收周期 <u>首个真实场景</u>（估算）</td></tr>
        <tr><td>你1：主干 + Marble World API 底稿 + Blender 精修</td><td>商用需 Pro 档约 <u>$35/月</u>；单世界 <u>约 $1.20</u>（1.1 档）；高质量网格限 <u>4 次/小时</u>；坐标需做 Y/Z 翻转修正</td><td>「一句话→可漫游场景」成立，美术起手快；但拿到的是静态有界世界</td><td>投入约 <u>$1.20</u>/世界 + <u>1–2 小时</u> 精修 → 产出场景底稿 → 回收周期 <u>每个新场景</u>（估算）</td></tr>
        <tr><td>你2：全链路产品化（上述全部 + 引擎落地 + 盲审自循环 + 沉淀成 skill）</td><td>首建约 <u>1–2 周</u>（估算）；月度生成成本约 <u>$5–40</u>（估算）；需一条真实业务线持续喂数据</td><td>唯一能规模化交付「海报/一句话 → 生产可用 3D 场景」的形态；依赖链长，任一环断链都要有降级路径</td><td>投入 <u>1–2 周</u> + 月度 <u>$5–40</u> → 产出可复用管线与 skill → 回收周期 <u>第 2 条场景起</u>（估算）</td></tr>
        </tbody>
        </table>
        </div>
        <hr />
        <h2>八、这份设计里最容易被跳过、但最不能省的三处</h2>
        <ol>
        <li><em>资产分流</em>（阶段 1）。跳过它，全靠生成，风格不统一 + 拓扑不可控 + 成本翻几倍。</li>
        <li><em>多视角参考图</em>（阶段 0）。只有一张图，后面全是靠猜。</li>
        <li><em>独立盲审</em>（阶段 6）。没有它，AI 会给自己打满分——这不是模型能力问题，是自我确认偏误。</li>
        </ol>
        <hr />
        <p>免责声明：本输出由 AI 辅助生成，仅用于信息整理与研究参考，不构成专业意见或决策依据。</p>
      </>
    ),
  },
  {
    slug: "stageshow-teardown",
    title: "Stageshow 技能拆解 · 研究笔记",
    date: "2026-11-12",
    authors: "Hang Yu",
    tags: ["Agent Skills", "逆向拆解"],
    body: (
      <>
        <blockquote><p><strong>English rephrase.</strong> How do I reverse-engineer the Stageshow agent skill from this Bilibili video, grab the real skill rather than guessing at it, and write up what it actually does — including whether the self-check loop it advertises really works?</p></blockquote>
        <hr />
        <h2>结论先行</h2>
        <p>Stageshow 是 X / SpaceXSI 设计负责人 Benji Taylor 于 2026-10-31 开源的 agent skill（MIT），装法一行 <code>npx skills add benjitaylor/skills --skill stageshow</code> [来源: 1-官方博客]。它的定位不是「生成 UI」，而是把设计师手做假界面时那「上百个小决定」写成一组可执行文件：<u>1 份主文档 + 15 份规则参考 + 155 个示例文件 + 30 个 React 零件 + 12 个自检脚本</u>，合计 <u>372 个文件 / 2,413,934 字节</u> [来源: 0-本机实测]。</p>
        <p>我在本机把它完整跑通了，并且做了对照实验，结论分三句：</p>
        <ol>
        <li><em>自检闭环是真的。</em> 我把作者自己的金标准示例 <code>static-card</code> 故意改坏，gate 以退出码 <u>1</u> 拦下，并逐条点名 <code>span.ss-text "$1,240" sits 4.0px from the right edge of div.ss-window</code> 这种带 CSS 选择器和像素值的诊断——不是泛泛说「排版有问题」。</li>
        <li><em>但它自己的金标准示例，在单帧模式下只有一半过 gate。</em> 我跑了 <u>20 个示例</u>，<u>10 个通过 / 10 个不通过</u>，且其中 <u>3 个</u> 触发的是 kit 自带 <code>Window</code> 组件（<code>.ss-window__bar</code>）踩了 kit 自己的 <code>uneven inset</code> 规则。</li>
        <li><em>判定不可复现，且本机达不到它的采样门槛。</em> 同一个 <code>linear</code> 示例连跑 <u>4 次</u>，<u>2 次通过 / 2 次失败</u>；整圈拍摄时采样间隙 <u>101.7 ms</u>，远超它 <u>16 ms</u> 的判定线，工具自己判为 <code>inconclusive</code>。</li>
        </ol>
        <p>所以它<em>能治几何失误，治不了「一眼假」的主因</em>——后者是构图和信息密度，人眼的事。作者自己也这么写：「The checks catch mistakes, not dull ideas. A demo can pass every one and still not be worth watching, so you still have to look at it yourself.」[来源: 1-官方博客]</p>
        <p><em>一个前置说明：视频本身没有可逆向的隐藏信息——Stageshow 是公开仓库，拿到源码比听讲解更准。所以我两条路都走了：视频下载+逐字稿留作对照，skill 直接从 GitHub 取源码。</em></p>
        <hr />
        <h2>一、素材侧：视频下载与逐字稿</h2>
        <h3>下载产物</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>文件</th>
        <th>规格</th>
        <th>体积</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>Stageshow技能拆解.mp4</code></td><td>480×852，时长 <u>4 分 38.53 秒</u></td><td><u>12,048,542 字节</u></td></tr>
        <tr><td><code>audio.mp3</code></td><td>16 kHz 单声道，48 kbps</td><td><u>1,672,691 字节</u></td></tr>
        <tr><td>源音频流</td><td>AAC LC 48 kHz 立体声，182 kbps</td><td><u>6,371,642 字节</u></td></tr>
        <tr><td>源视频流</td><td>avc1.640033，157 kbps</td><td><u>5,492,627 字节</u></td></tr>
        </tbody>
        </table>
        </div>
        <p>视频元数据：<code>BV1ujWb6tEsg</code>，标题《让 AI 做的界面不再一眼假——Stageshow 技能拆解》，UP 主「翻车老头」（mid 437853937），发布 <u>2026-11-11</u>，发布约一天时播放 <u>408</u>、点赞 <u>8</u>、收藏 <u>22</u>、弹幕 <u>0</u> [来源: 0-本机实测]。</p>
        <h3>视频讲了什么</h3>
        <p>作者自建了 <u>16 段</u>章节（0:00 开场四种翻车 → 0:28 一条命令 → 0:52 五种失败模式 → 1:15 一句话总纲 → 1:25 参考库 → 1:41 黄金示例 → 1:53 薄零件 → 2:15 验收拍成胶片 → 2:32 两帧之间的问题 → 2:44 七步工作流 → 3:10 取景细节 → 3:44 十款真实产品 → 3:59 局限 → 4:11 收束）。</p>
        <p>逐字稿里最值得摘的三句（我的转写，非原文字幕）：</p>
        <ul>
        <li>「技术没变，组件也没变。模型很会写组件，但他常常不知道什么叫像真的。他缺的是一套界面判断。」</li>
        <li>「他给智能体的是七步：先定媒介……先决定再动手，大部分演示就死在动手太早。」</li>
        <li>「检查只能抓错误，抓不了无聊；检查能过，不代表值得看。」</li>
        </ul>
        <p>这三条与源码完全对得上，不是二手转述。</p>
        <hr />
        <h2>二、结构解剖：这个 skill 到底由什么组成</h2>
        <p>仓库 <code>github.com/benjitaylor/skills</code>，HEAD <code>299140f</code>，MIT 许可 [来源: 0-本机实测]。</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>层</th>
        <th>文件数</th>
        <th>体积</th>
        <th>职责</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>SKILL.md</code></td><td>1</td><td><u>153 行</u>，version 1.1.1</td><td>总纲：中心句、五种失败、七步工作流、金标准表、kit 概览</td></tr>
        <tr><td><code>references/</code></td><td>15</td><td><u>165,290 字节</u></td><td>规则库：craft / motion / framing / bento / looks / backgrounds / annotations / products / brands / rehearse / review / verify / teaching / kit / choreography</td></tr>
        <tr><td><code>examples/</code></td><td>155</td><td>—</td><td>金标准示例、真实产品研究、零件样本</td></tr>
        <tr><td><code>kit/</code></td><td>30</td><td>—</td><td>React 零件：舞台、窗口、手机、光标、动作原语、小组件</td></tr>
        <tr><td><code>scripts/</code></td><td>12</td><td><u>262,105 字节</u></td><td>自检：<code>film.mjs</code>、<code>jumps.mjs</code>、<code>layout.mjs</code>、<code>motion-watch.mjs</code> 等</td></tr>
        <tr><td><code>teaching/</code></td><td>18</td><td>—</td><td><u>9 组</u>坏/好配对，用于诊断</td></tr>
        </tbody>
        </table>
        </div>
        <p>两个关键体量数字：<code>film-checks.mjs</code> 一个文件 <u>139,488 字节</u>，是全部自动规则的实现；<code>act.ts</code> <u>32,038 字节</u>，是动作编排 API。</p>
        <p><code>kit/</code> 里最重的几个零件：<code>act.ts</code>（<u>32,038 字节</u>）、<code>stage.tsx</code>（<u>26,646 字节</u>）、<code>phone.tsx</code>（<u>18,757 字节</u>）、<code>window.tsx</code>（<u>13,222 字节</u>）。</p>
        <p>关于 git 历史：仓库只有 <u>3 次提交</u>（2026-10-30 / 11-03 / 11-04），作者显然做过 rebase 或强推，<em>所以「迭代速度有多快」这个问题用 git 答不了</em> [来源: 0-本机实测]。</p>
        <hr />
        <h2>三、机制：它凭什么能治「一眼假」</h2>
        <h3>1. 五种失败模式 = 一张负向清单</h3>
        <p>SKILL.md 开篇就钉死五种翻车：<em>Too much</em>（每格都塞真词）、<em>Wireframe</em>（两个灰块加按钮）、<em>Boxed</em>（整扇窗口缩进卡片，像贴了张截图）、<em>Flat</em>（所有东西同权重）、<em>Bland</em>（brief 要的风格没出现）。这五条不是描述，是<em>验收标准</em>——任何一条命中就是不合格。</p>
        <p>作者原话解释了为什么这五条值得单独列：「Most good models can do this now without a dedicated skill, but the results often look sloppy and heavy-handed, and that's the gap Stageshow is for.」[来源: 1-官方博客]</p>
        <h3>2. 七步工作流 = 顺序约束</h3>
        <p>Medium（静帧还是动画、放哪、多大）→ Look（light / dark / blueprint / glass + 保真度）→ Story（三到五拍故事）→ Examples（拷最接近的金标准）→ Screen（只留 <u>3 到 7</u> 条真字，其余占位线）→ Choreograph（节拍重叠、错开、循环闭合）→ Rehearse（拍片、逐帧读、并排比金标准）。</p>
        <p>七步里<em>只有第 5、6 步需要写代码</em>，前四步是定方向，第七步是验货。这个排序本身就是它治「一眼假」的核心——<em>大部分演示死在动手太早</em>。</p>
        <h3>3. references = 每条规则都带「为什么」</h3>
        <p><code>craft.md</code> 里的条目几乎全是可断言的数值判据，不是形容词：</p>
        <ul>
        <li>「Words keep a 12px inset from the edge of a window, card, panel or hovered row」</li>
        <li>「Row padding is 12px, 8px for a dense list; a one-line row three times taller than its words is a <code>fat row</code>」</li>
        <li>「Icons come from a set, never from your hand… A glyph drawn by hand is the first tell of generated UI」</li>
        <li>「AI features get no sparkle, wand or star, and no purple as the AI color」</li>
        </ul>
        <p>作者在博客里点明了这一层的来历：「Most of the rules started as a note on a real demo, like "the shadow is too harsh" or "this title isn't centred." Once a note is in the skill, every demo after it gets it for free.」[来源: 1-官方博客]</p>
        <h3>4. kit = 把「手工容易做错」的部分预置</h3>
        <p>不是让 agent 从零画窗口，而是给真实几何：<code>Window</code> / <code>Phone</code> / <code>LockScreen</code> / <code>Thread</code> / <code>Bubble</code>，动作原语 <code>Collapse</code> / <code>Roll</code> / <code>Swap</code> / <code>Count</code> / <code>Connector</code> / <code>Fly</code> / <code>Camera</code> / <code>Expand</code>，小零件 <code>Bar</code> / <code>Text</code> / <code>Row</code> / <code>Card</code> / <code>Button</code> / <code>Chip</code> / <code>Toast</code>。SKILL.md 里有一条硬约束：<em>「Use the kit part, never a lookalike」</em>——自己手搓一个按钮，就是间距不齐、文字被挤的来源。</p>
        <p>光标可以按名字瞄准（<code>data-target</code> / <code>data-cursor</code>），位置一律 <code>rect()</code> 实测，禁止硬编码。</p>
        <h3>5. 自检闭环 = 拍片 + <u>51</u> 条规则 + <u>24</u> 条硬伤清单</h3>
        <p>这是整个 skill 最有价值的部分，也是我重点验证的部分。</p>
        <ul>
        <li><code>film.mjs</code> 用 headless Chrome 按固定间隔拍舞台，拼成一张接触印样（contact sheet），同时输出可量化的报告。</li>
        <li><code>film-checks.mjs</code> 里实现了 <u>51 个</u> <code>detect*</code> 规则函数（<code>detectFatRow</code>、<code>detectEmojiIcon</code>、<code>detectHeroFraming</code>、<code>detectTightInset</code>……）。</li>
        <li><code>references/rehearse.md</code> 列了 <u>24 条</u> <em>never intentional</em> 硬伤：命中即失败，不接受「这是故意的」辩解。</li>
        <li><code>--gate</code> 模式下，全部硬伤归零才输出 <code>rehearsal passed</code>，否则退出码 <u>1</u>。</li>
        <li>覆盖度不足时输出 <code>inconclusive</code> 并退出码 <u>2</u>——<em>它拒绝把没测全当成通过</em>。</li>
        </ul>
        <p>作者博客对为什么要这样做的解释很直接：「Neither shows the motion in between, which is where the bugs often are: a pill that hops 4px on its way in, or one frame where everything has faded out.」[来源: 1-官方博客]</p>
        <hr />
        <h2>四、实测：本机跑通了什么</h2>
        <h3>环境</h3>
        <p>Windows / PowerShell 5.1，Node <u>v22.16.0</u>，npm <u>10.9.2</u>，Vite 6.4.5（ready in <u>1117 ms</u>），Chrome（通过 <code>CHROME_PATH</code> 指向 playwright-core），imageio-ffmpeg 7.1。依赖安装 <u>73 个包 / 7 秒</u>。</p>
        <h3>复现命令</h3>
        <pre data-lang="sh"><code>git clone --depth 1 https://github.com/benjitaylor/skills.git
        cd skills/stageshow &amp;&amp; npm install &amp;&amp; npm run dev        # → http://127.0.0.1:5173
        node scripts/film.mjs "http://127.0.0.1:5173/?capture=static-card" --out shots/a.png --still --gate</code></pre>
        <p>Windows 上两个坑：npm 的 <code>--prefix</code> 会被中文路径吃掉（报 <code>ENOENT</code>），要用 <code>Set-Location</code> 进目录；<code>imageio-ffmpeg</code> 自带的 ffmpeg 编 mp3 要用 <code>-c:a libmp3lame</code>，用 <code>-c:a aac</code> 会以 <code>-22</code> 报错但仍能读源文件。</p>
        <h3>结果一：自检闭环是真的（对照实验）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>组</th>
        <th>对象</th>
        <th>gate 判定</th>
        <th>退出码</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>对照组</td><td><code>static-card</code> 原版</td><td><code>rehearsal passed</code>，仅 1 条 <code>lopsided</code> 候选，coverage complete</td><td><u>0</u></td></tr>
        <tr><td>实验组 v1</td><td>改坏版 <code>static-card</code></td><td><code>rehearsal failed: 2 never-intentional line(s)</code></td><td><u>1</u></td></tr>
        <tr><td>实验组 v2</td><td>按规则前置条件重做的突变体</td><td><code>rehearsal failed: 4 never-intentional line(s)</code></td><td><u>1</u></td></tr>
        </tbody>
        </table>
        </div>
        <p>实验组 v1 被抓到的诊断（原文）：</p>
        <pre><code>tight inset: span.ss-text "$1,240" sits 4.0px from the right edge of div.ss-window;
                     words keep the container's inset (12px or more on a row, card or window), only filler bleeds
        clipped: span.ss-bar clipped bottom by 17px by div.ss-window</code></pre>
        <p>实验组 v2 我按 <code>film-checks.mjs</code> 的前置条件精确构造，三条注入故障全部被点名：</p>
        <pre><code>emoji icon: span "✨" stands where an icon belongs (a 24px seat beside words);
                     emoji are content, icons are drawn, one family tinted to the look
        fat row:    div.mv-row "Halvorsen &amp; Company Inte" is 60px tall for one 13px line
                     (2 of 3 rows in div.mv-list are); a one-line row is its words plus 8 to 12px of padding each side
        framing:    div.ss-window floats whole in the stage with 60/60/20/20px of air around it;
                     a hero's window bleeds off one or two edges with one gutter, or fills the stage</code></pre>
        <p><em>每一条都带元素选择器、像素测量值、以及对应的规则出处。</em>这是可执行的判据，不是建议。</p>
        <h3>结果二：它自己的金标准示例，只有 <u>50%</u> 过 gate</h3>
        <p>对 <u>20 个</u>示例跑 <code>--still --gate</code>：</p>
        <ul>
        <li>通过（<u>10 个</u>）：<code>static-card</code> <code>hero-demo</code> <code>payout-flow</code> <code>form-error</code> <code>presence</code> <code>subscriptions</code> <code>close-up</code> <code>dynamic-island</code> <code>spotify</code> <code>gmail</code></li>
        <li>不通过（<u>10 个</u>）：<code>dark-bento</code> <code>ai-chat</code> <code>reorder</code> <code>chart-scrub</code> <code>dark-hero</code> <code>bento</code> <code>messages</code> <code>upload</code> <code>swipe</code> <code>linear</code></li>
        </ul>
        <p>失败项的具体触发规则：</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>示例</th>
        <th>触发的规则</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>ai-chat</code> / <code>reorder</code></td><td><code>uneven inset: div.ss-window__bar holds its children 15px from its left edge and 51px from its right</code></td></tr>
        <tr><td><code>dark-hero</code></td><td><code>uneven inset: span.dh-nav holds its children 8px from its left edge and 30px from its right</code></td></tr>
        <tr><td><code>dark-bento</code></td><td><code>uneven inset</code>（头像上下 12px、左 25px）+ <code>touching</code>（占位条距头像 5px）</td></tr>
        <tr><td><code>chart-scrub</code></td><td><code>loose stack: div.cs-label "Last 14 days" sits 10.3px of ink above div.cs-value "$68,200"</code></td></tr>
        <tr><td><code>messages</code></td><td><code>uneven gutters: div.ss-phone sits 47px from the left … 16px from the bottom</code></td></tr>
        <tr><td><code>upload</code></td><td><code>framing: corner bleed with a 40px gutter above div.ss-window but 184px to its left</code></td></tr>
        <tr><td><code>swipe</code></td><td><code>framing: div.ss-phone ends 10px short of the right edge</code> + 2 条 <code>touching</code></td></tr>
        <tr><td><code>bento</code></td><td><code>translucent icon</code> + <code>half-pixel glyph</code> + <code>avatar alignment</code> + 3 条 <code>lopsided</code></td></tr>
        </tbody>
        </table>
        </div>
        <p>其中 <code><u>3 个</u></code>示例触发的是 <code>.ss-window__bar</code>——<em>kit 自带的窗口工具栏</em>。我查了 <code>kit/window.css</code>，它用的是对称 padding（<code>padding: 0 calc(var(--ss-lights-y) - var(--ss-dot) / 2)</code>），右侧那 51px 是 URL 字段的刻意留白。<em>kit 踩了 kit 自己的规则。</em></p>
        <h3>结果三：判定不可复现</h3>
        <p>同一个 <code>linear</code> 示例、同一台机器、同一命令，连跑 <u>4 次</u>：</p>
        <pre><code>run 1 : rehearsal passed
        run 2 : rehearsal passed
        run 3 : rehearsal failed: 1 never-intentional line(s)
                 -&gt; uneven inset: div.ln-row holds its children 12px from its left edge and 68px from its right
        run 4 : rehearsal failed: 1 never-intentional line(s)   ← 与 run 3 同一条</code></pre>
        <h3>结果四：本机达不到它自己的采样门槛</h3>
        <p>整圈拍摄 <code>hero-demo</code>（<code>--every 1000 --count 18</code>）：</p>
        <pre><code>coverage stage-1: 1736 frames, 17.85s, largest gap 101.7ms (inconclusive)
          incomplete: 36 sampling gap(s) exceeded 16ms; motion during those gaps was not judged</code></pre>
        <p>放慢时钟重拍（<code>--slow 6 --every 40 --count 60</code>）把最大间隙压到 <u>28.5 ms</u>，但仍有 <u>25 处</u>超过 16 ms，结论依旧是 <code>inconclusive</code>。<em>它宁可说「没测全」，也不把没测全当通过——这点是对的，但代价是在本机基本拿不到确定性结论。</em></p>
        <p>值得注意的是，<code>hero-demo</code> 在单帧模式下通过、在整圈模式下反而报出两条硬伤：<code>dashed edge resizes</code>（<code>div.hd-dragbox</code> 虚线边框每帧重排）和 <code>vanishes with no exit</code>（<code>div.hd-selection</code> 一帧内消失无退场）。<em>这正是这个 skill 主张的场景：问题藏在两帧之间，单帧截图抓不到。</em></p>
        <hr />
        <h2>五、盲区与局限</h2>
        <h3>5.1 规则有很硬的前置条件，不是通用判据</h3>
        <p>我第一版突变体注入了 <u>4 个</u>故障，只被抓到 <u>1 个</u>。读源码才明白原因：</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>规则</th>
        <th>前置条件</th>
        <th>后果</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>fat row</code></td><td>行内<strong>不能含 <code>.ss-bar</code></strong>；文字宽 ≥ 行宽 40%；行宽 ≥ 120px；高 &gt; <code>fs×3.4</code> 且 &gt; 48px；同容器内 rows≥3 且 fat≥2</td><td>用占位条填充的列表永远不会触发</td></tr>
        <tr><td><code>emoji icon</code></td><td>emoji 须为叶子节点、文本 ≤3 字符、命中 emoji 正则；<strong>父盒 ≤56×56 且不含字母</strong>；祖父级含 ≥3 连续字母</td><td>放在带文字容器里的 emoji 漏检</td></tr>
        <tr><td><code>framing: floats whole</code></td><td><strong>仅当 stage 宽 ≥560px</strong>；四边留白 ≥12px；窗口面积 &lt; 舞台面积 0.82</td><td>卡片尺寸（400px）的舞台不适用</td></tr>
        <tr><td><code>invented mark</code></td><td>品牌色字母块 + 同行出现真公司名</td><td>纯虚构品牌不触发</td></tr>
        </tbody>
        </table>
        </div>
        <p><em>这不是 bug，是设计——规则要精准就必须有前提。</em>但代价是使用者必须知道前提，否则会误以为「工具没抓到 = 没问题」。</p>
        <h3>5.2 kit 与规则存在版本错位</h3>
        <p><code>ai-chat</code> / <code>reorder</code> / <code>dark-hero</code> 三个示例触发的是 kit 自己的 <code>.ss-window__bar</code>。仓库最新一次提交写的是「Stageshow 1.1.0: new kit parts and a stricter gate」——<em>gate 收紧了，kit 没跟上</em>。严格照 skill 执行的用户，会被卡在一个作者自己都没走完的修复循环里。</p>
        <h3>5.3 判定不确定</h3>
        <p><code>linear</code> 4 跑 2 过 2 不过，说明判定存在时序依赖（可能是 still 捕获时动画尚未完全落定）。<strong>不能把单次 gate 结果当作结论。</strong></p>
        <h3>5.4 覆盖度不足时结论不可用</h3>
        <p>本机 headless Chrome 达不到 <u>16 ms</u> 的采样间隙要求，动画类检查基本只能拿到 <code>inconclusive</code>。<em>静态构图类检查（tight inset / fat row / framing）可靠，运动类检查（jump / loop seam / selection drift）在本机基本不可用。</em></p>
        <h3>5.5 检查抓不了「无聊」</h3>
        <p>作者自陈：「The checks catch mistakes, not dull ideas. A demo can pass every one and still not be worth watching.」并且「It also can't draw, so anything that needs illustration or photography is better made by hand and dropped in.」[来源: 1-官方博客]</p>
        <h3>5.6 它是个人品味，不是中立标准</h3>
        <p>作者脚注原话：「It also means Stageshow is my taste, not a neutral one.」[来源: 1-官方博客] 这决定了它适合做<em>下限</em>（避免几何失误），不适合做<em>上限</em>（创意与风格）。</p>
        <h3>5.7 作者自己预期它会被淘汰</h3>
        <p>「Model taste is getting better with every release, and I suspect a skill like this is only useful for a while, since much of what it teaches and includes could soon come built in.」他同时补充：关于取景和运动的规则最耐久，因为「Models are perfectly capable of getting those right, but they don't seem to know that they matter until something tells them.」[来源: 1-官方博客]</p>
        <hr />
        <h2>六、判断与建议</h2>
        <p><em>[判断与建议]</em> 以下是我的判断，不是已核实事实。</p>
        <ol>
        <li><em>值得抄的是「机制」，不是「文件」。</em> 真正的可复用资产是三件事：<strong>负向清单</strong>（先列出会怎么错）、<strong>带理由的数值规则</strong>（12px inset / 3× 行高 / 一族图标）、<strong>强制自检回路</strong>（拍片 → 逐帧 → 修 → 再拍）。这三条跟 React 无关，换成 Godot / UE 的 UI 也成立。</li>
        <li><em>规则要带前置条件才可用。</em> 抄规则时必须连前置条件一起抄，否则会得到大量漏检。</li>
        <li><em>别指望它替代判断。</em> 它的价值在「下限」，「上限」仍然是人和模型的品味。</li>
        <li><em>接进工作流时，把 gate 当 lint 用，不要当验收。</em> 单次结果不可复现（本机 2/4），合理用法是「反复跑 + 看趋势」，或者只信静态构图类规则。</li>
        <li><em>对本机的具体建议：</em> 它的 <code>playwright-core</code> 依赖在 Windows 上表现不理想（采样间隙过大），若要正式接入，需要换更高性能的截图路径或降低采样密度要求。</li>
        </ol>
        <h3>相关 skill（顺手核实过）</h3>
        <p>同类的 <code>fun-isometric</code>（作者 Kelvin Adithya，MIT，仓库 <code>kelvinkn17/skills</code> @ <code>7c8a752</code>）我也拉下来看了：它走的是<strong>另一个方向</strong>——不治「假」，治「不会动」，把 After Effects 关键帧预设做成 lottie 式插值，产出可实时播放的等距贴纸图标模块。两者不冲突：<code>Stageshow</code> 管<em>界面像不像产品</em>，<code>fun-isometric</code> 管<em>插画动得动不动</em>。后者需要 Bun + ffmpeg 做视频导出。</p>
        <p><em>另外注意：外媒报道的 Stageshow 版本是 0.1.0 / 2026-10-31 发布，当前仓库已经是 1.1.1 / 2026-11-04。凡是引用「Stageshow 怎么装、包含什么」的二手文章，请以仓库现状为准。</em></p>
        <hr />
        <h2>表格总结：</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>选项</th>
        <th>代价</th>
        <th>影响</th>
        <th>ROI</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>我1（agent 侧）：把 Stageshow 装进本机 skill 库，接到本仓库的界面产出流程</td><td>磁盘 <u>约 2.4 MB</u> + 73 个 npm 包；需 Node ≥20.19（本机 v22.16.0 满足）；多一个 React/Vite/playwright-core 依赖树</td><td>界面产出从「模型自由发挥」变成「先定七步再写码」，几何失误显著下降；本机动画类 gate 仍不可用，只有静态构图类规则可依赖</td><td>投入 <u>约 30 分钟</u>接入 + 每次产出多 <u>1 到 2 轮</u>拍摄自检；产出=几何失误率下降；回收周期 <u>1 个界面产出即回本（估算）</u></td></tr>
        <tr><td>我2（agent 侧）：不装，只把五种失败模式 + 七步 + 24 条硬伤清单抽成自用 review 清单</td><td><u>约 1 小时</u>整理；无新依赖</td><td>拿到 70% 的收益（避免装盒/装满/太扁/风格丢失），失去 51 条自动规则与像素级测量；「机器检查」退化为「人工核对」</td><td>投入 <u>约 1 小时</u>；产出=返工率下降，回收周期 <u>2 到 3 个界面产出（估算）</u>；但零依赖、零维护成本，长期 ROI 更高</td></tr>
        <tr><td>你1（你这边）：用 Stageshow 重做一个具体的界面产出（营销页 hero / feature card）</td><td><u>约 1 到 2 小时</u>人工 review + <u>2 到 3 轮</u>反馈；产出是普通 React 组件，可直接进项目</td><td>一次能验证「这技能在你的产品语境里成不成立」，比读文档可靠；但作者自陈多数 demo 仍需多轮反馈</td><td>投入 <u>1 到 2 小时</u>；产出=1 个可用的 demo + 一份判断依据；回收周期 <u>1 次即回本（估算）</u></td></tr>
        <tr><td>你2（你这边）：维持现状，只把它当参考读物</td><td><u>0</u></td><td>什么都不变；继续踩「信息塞满 / 整窗缩卡片 / 所有东西同权重」这些老坑</td><td>投入 <u>0</u>；产出=0；回收周期<u>不适用</u>；但也避免了 <u>约 2.4 MB</u>依赖和版本跟不上的维护负担</td></tr>
        </tbody>
        </table>
        </div>
        <hr />
        <h2>参考来源</h2>
        <ul>
        <li>[来源: 0-本机实测] 2026-11-12 在本机（Windows / Node v22.16.0 / Chrome）克隆 <code>benjitaylor/skills</code> @ <code>299140f</code>，安装依赖、起 playground、跑 <code>film.mjs --gate</code> 共 <u>40 次</u>，并构造两组突变体做对照实验。原始产物见 <code>evidence/</code> 目录。</li>
        <li>[来源: 1-官方博客] Benji Taylor,《Stageshow》, 2026-10-31, <a href="https://benji.org/stageshow" target="_blank" rel="noreferrer">https://benji.org/stageshow</a> —— 作者自述，含中心句、七步表、五种失败、局限与脚注。</li>
        <li>[来源: 1-官方仓库] <a href="https://github.com/benjitaylor/skills" target="_blank" rel="noreferrer">https://github.com/benjitaylor/skills</a> —— SKILL.md、references/、scripts/、kit/ 全部规则与实现，MIT 许可。</li>
        <li>[来源: 1-相关仓库] <a href="https://github.com/kelvinkn17/skills" target="_blank" rel="noreferrer">https://github.com/kelvinkn17/skills</a> —— <code>skills/fun-isometric/SKILL.md</code>，MIT，作者 Kelvin Adithya。</li>
        <li>[来源: 3-二手报道，仅供参考] nvdium.com、aicoder.com、mlllm.io、creatorstoolbox.com 关于发布首帖点赞/收藏数与仓库 star 数的报道。<em>各家数字互相冲突（如首帖点赞 <u>3400 / 4521 / 4700</u>），且均为作者自述或媒体转述，未见第三方评测；本报告未采信任何一项作为结论。</em></li>
        </ul>
        <hr />
        <p>免责声明：本输出由 AI 辅助生成，仅用于信息整理与研究参考，不构成专业意见或决策依据。</p>
      </>
    ),
  },
  {
    slug: "mutation-testing",
    title: "变异测试（Mutation Testing）调研总结",
    date: "2026-11-12",
    authors: "Hang Yu",
    tags: ["软件测试", "Agent Skills"],
    body: (
      <>
        <blockquote><p>触发源：B 站切片【Matt Pocock】变异测试太强了（BV1PQxk6fES8） 原片：YouTube《Mutation testing is AWESOME》（video id <code>djSbndoByr8</code>） 调研日期：2026-11-12</p></blockquote>
        <hr />
        <h2>英文重述</h2>
        <blockquote><p>Download this Bilibili video, then research whether there are existing <strong>agent skills</strong>, <strong>open-source plugins</strong>, <strong>MCP servers</strong>, or <strong>guides</strong> for the technique it covers (mutation testing). If nothing suitable exists, write the findings up as a Markdown summary instead.</p></blockquote>
        <hr />
        <h2>结论先行</h2>
        <ol>
        <li><em>现成资产是有的，而且质量不低</em>：本次共核实出 <u>3 个可直接安装的 agent skill</u>、<u>1 个可运行的 MCP server</u>、<u>1 份覆盖 13 种语言的框架安装对照表</u>、<u>1 份已失效的 MCP 登记</u>。</li>
        <li><em>但本机没有</em>：本地 <u>262 个 skill</u> 中对 <code>mutation|mutant|变异|stryker|mutmut|pitest</code> 的全文检索为 <u>0 命中</u>；当前已配置的 <u>2 个 MCP server</u>（<code>actor-critique-loop</code>、<code>blender</code>）也不涉及变异测试。<em>结论是要「装或抄」，不是「没有所以自己从零写」。</em></li>
        <li><em>最强的三个 skill 各有侧重，不能互相替代</em>：</li>
        </ol>
        <ul>
        <li><code>genotoxic</code>（Trail of Bits）做<strong>分诊</strong>——把「存活变异体」进一步分类成 误报 / 缺测试 / 该上 fuzz / 双工具互证；</li>
        <li><code>mutation-tester</code>（adiomas）做<strong>工作流</strong>——接在 TDD 的 GREEN 之后，只对 git diff 增量跑，带阈值与阻断策略；</li>
        <li><code>mutation-testing</code>（aks-builds）做<strong>知识手册</strong>——操作符表、语言选型、CI 集成模式、常见坑。</li>
        </ul>
        <ol>
        <li><em>MCP 侧：<code>mutmut-mcp</code> 可用但 npm 上不存在</em>，必须走 git 源安装；<code>test-trust</code> 的 GitHub 仓库在本次核验时已 <u>404「Page not found」</u>，<em>不要照抄目录站去装</em>。</li>
        <li><em>这段视频的重点不是「测试质量」，而是「给 AI agent 的反馈信号」</em>。原片英文字幕原文是「This gives your <strong>agent</strong> really rich feedback about how good its tests are」——讲的是怎么给编码 agent 一个比「CI 绿了」更硬的信号。这与上面几个 skill 的设计取向完全一致。</li>
        </ol>
        <hr />
        <h2>一、视频本体（已核实）</h2>
        <h3>1.1 两个版本的元数据</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>项</th>
        <th>B 站切片</th>
        <th>YouTube 原片</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>ID</td><td>BV1PQxk6fES8 / cid 43207689213</td><td><code>djSbndoByr8</code></td></tr>
        <tr><td>标题</td><td>【Matt Pocock】变异测试太强了</td><td>Mutation testing is AWESOME</td></tr>
        <tr><td>作者</td><td>科技小火龙</td><td>Matt Pocock（@mattpocockuk，<u>43.7 万</u>订阅）</td></tr>
        <tr><td>时长</td><td><u>58 秒</u></td><td>—</td></tr>
        <tr><td>发布</td><td><u>2026-10-31 18:05</u>（UTC+8）</td><td><u>2026-10-14</u></td></tr>
        <tr><td>观看 / 点赞</td><td>—</td><td><u>131,702</u> 次观看 / <u>2,515</u> 赞</td></tr>
        <tr><td>音轨</td><td>中文配音</td><td>英文原声 + YouTube 自动配音中文轨</td></tr>
        <tr><td>来源</td><td>描述里直接给出 YouTube 链接</td><td>—</td></tr>
        </tbody>
        </table>
        </div>
        <p>B 站片是原片的<strong>自动配音中文切片</strong>，不是独立内容。因此下文的「视频说了什么」以原片为准，中文音轨仅作对照。[来源: 3-YouTube oEmbed / watch 页]</p>
        <h3>1.2 画面证据（已抽帧核对）</h3>
        <p>StrykerJS 变异测试报告面板可见三个计数徽标：</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>Killed</th>
        <th>Survived</th>
        <th>NoCoverage</th>
        <th>合计</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><u>35</u></td><td><u>31</u></td><td><u>4</u></td><td><u>70</u></td></tr>
        </tbody>
        </table>
        </div>
        <p>由此算出的变异分数（脚本计算，非心算）：</p>
        <ul>
        <li><code>mutation score = killed / (killed + survived) = 35 / 66 = <u>53.03%</u></code></li>
        <li>若按 <code>killed / total = 35 / 70 = <u>50.00%</u></code> 口径（部分工具把 NoCoverage 也算进分母）</li>
        </ul>
        <p><em>这个分数本身就是演示效果的一部分</em>：它说明<strong>同一套用例，行覆盖率可以很高，但仍然漏掉一半的变异</strong>——这正是变异测试相对行覆盖率的核心卖点。</p>
        <h3>1.3 逐句转写与术语纠正</h3>
        <p>中文音轨是机器自动配音，术语翻译有明显错误。以下为<strong>纠正后</strong>的语义：</p>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>中文音轨原文</th>
        <th>纠正后</th>
        <th>说明</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>变化测试</td><td><strong>变异测试 / mutation testing</strong></td><td>全文术语</td></tr>
        <tr><td>变化</td><td><strong>变异体 / mutant</strong></td><td>不是「变化」</td></tr>
        <tr><td>生存的变化</td><td><strong>存活变异体 / survived mutant</strong></td><td>测试没抓到</td></tr>
        <tr><td>需要被杀死的变化</td><td><strong>被杀死变异体 / killed mutant</strong></td><td>测试抓到了</td></tr>
        <tr><td>你的原则</td><td><strong>你的源码</strong></td><td>机器误译</td></tr>
        <tr><td>测试员</td><td><strong>测试 / test</strong></td><td>机器误译</td></tr>
        <tr><td>有点害怕测试员的测试效果</td><td><em>—</em></td><td>音轨在此处已不可靠，见 1.4</td></tr>
        </tbody>
        </table>
        </div>
        <h3>1.4 原片论述主线（据原片英文字幕 + 音轨对齐）</h3>
        <ol>
        <li>高质量的测试套件是重要的，<em>但你怎么知道它真的能兜住 bug</em>？变异测试给出答案。</li>
        <li>变异测试对源码施加一处可控改动（片中演示把字符串改成空串），然后<strong>重跑测试</strong>，看用例是否会失效。</li>
        <li>每个变异体落进两个桶：<strong>被杀死</strong>（有用例报错，测试有效）或<strong>存活</strong>（全部照过，测试有盲区）。</li>
        <li>这个结果给 agent 提供「每个用例到底在抓哪类变异」的<strong>结构化反馈</strong>。</li>
        <li>工具选择依语言而定，片中用的是 <strong>StrykerJS</strong>。</li>
        </ol>
        <h3>1.5 已知信息盲区</h3>
        <ul>
        <li>B 站切片只截了 <u>58 秒</u>，原片完整版<strong>未下载、未完整转写</strong>——本次只核实了切片段落内的论点。原片对「如何把变异测试接进 agent 循环」的完整论述未覆盖。</li>
        <li>YouTube 页面显示有自动生成的字幕轨（繁体），本次未抓取该轨做逐句对齐。</li>
        </ul>
        <hr />
        <h2>二、检索结果</h2>
        <h3>2.1 Agent Skills（<u>3 个</u>，全部已读取原文核实）</h3>
        <p>#### ① <code>genotoxic</code> — Trail of Bits</p>
        <ul>
        <li>位置：<code>bongkage/trailofbits-skills</code> → <code>plugins/trailmark/skills/genotoxic/</code></li>
        <li>仓库：<code><a href="https://github.com/bongkage/trailofbits-skills" target="_blank" rel="noreferrer">https://github.com/bongkage/trailofbits-skills</a></code>（<code>git ls-remote</code> 通过，仓库公开）</li>
        <li>原文：<code><a href="https://raw.githubusercontent.com/bongkage/trailofbits-skills/main/plugins/trailmark/skills/genotoxic/SKILL.md" target="_blank" rel="noreferrer">https://raw.githubusercontent.com/bongkage/trailofbits-skills/main/plugins/trailmark/skills/genotoxic/SKILL.md</a></code></li>
        </ul>
        <p><em>这是本次找到的最完整的一个</em>，它不是「跑一次变异测试」，而是三件工具的编排：</p>
        <pre><code>Phase 1  代码图构建   trailmark analyze --language auto --summary &#123;dir&#125;
        Phase 2  变异测试     按语言选框架（mutmut / Stryker / cargo-mutants / ...）
        Phase 2b necessist    删掉测试语句看是否还通过（可选，与 Phase 2 并行）
        Phase 3  分诊        用图数据把结论分成 4 桶</code></pre>
        <p>输出的 4 个桶：<code>Corroborated</code>（两个工具指向同一函数，置信度最高）、<code>False Positives</code>（误报）、<code>Missing Tests</code>（该补用例）、<code>Fuzzing Targets</code>（该上 fuzz 而不是写单测）。报告落盘为 <code>GENOTOXIC_REPORT.md</code>。</p>
        <p>它的<strong>语言框架对照表</strong>（<code>references/mutation-frameworks.md</code>）是本次检索到的最有复用价值的单一文件，覆盖 <u>13 种语言</u>的安装命令、配置模板、运行命令、以及「怎么解析出存活变异体」的 jq/grep 片段。</p>
        <blockquote><p>注意它有两条<strong>明确的禁止项</strong>：框架装不上时<strong>不允许</strong>退化成「手动分析」冒充变异测试；necessist 与变异测试是两个不同工具，不允许因为「necessist 不是变异测试」就跳过。</p></blockquote>
        <p>#### ② <code>mutation-tester</code> — adiomas</p>
        <ul>
        <li>位置：<code>adiomas/claude-code-adiomas-plugins</code> → <code>autonomous-dev/skills/mutation-tester/</code></li>
        <li>仓库：<code><a href="https://github.com/adiomas/claude-code-adiomas-plugins" target="_blank" rel="noreferrer">https://github.com/adiomas/claude-code-adiomas-plugins</a></code>（<code>git ls-remote</code> 通过）</li>
        <li>原文：<code><a href="https://raw.githubusercontent.com/adiomas/claude-code-adiomas-plugins/main/autonomous-dev/skills/mutation-tester/SKILL.md" target="_blank" rel="noreferrer">https://raw.githubusercontent.com/adiomas/claude-code-adiomas-plugins/main/autonomous-dev/skills/mutation-tester/SKILL.md</a></code></li>
        </ul>
        <p><em>偏工作流编排</em>，明确把变异测试接进 TDD 循环：</p>
        <pre><code>RED → GREEN → REFACTOR → MUTATE → ✓
                                 ↓
                            Score &lt; 80%?
                                 ↓
                          补测试 → 回到 RED</code></pre>
        <p>要点：只对 <code>git diff --name-only HEAD~1</code> 命中的文件做<strong>增量</strong>变异；<code>coverageAnalysis: "perTest"</code>；给出 <u>80%</u>（关键路径阻断）/ <u>60%</u>（任意改动阻断）/ <u>60–80%</u>（警告）三档阈值；并明确列了 <u>6 条不该用</u>的场景（没有配置工具、测试还没写、纯 UI 改动、生成代码、时间敏感任务、配置文件）。</p>
        <p>#### ③ <code>mutation-testing</code> — aks-builds</p>
        <ul>
        <li>位置：<code>aks-builds/quality-skills</code> → <code>skills/mutation-testing/</code></li>
        <li>仓库：<code><a href="https://github.com/aks-builds/quality-skills" target="_blank" rel="noreferrer">https://github.com/aks-builds/quality-skills</a></code>（<code>git ls-remote</code> 通过）</li>
        <li>原文：<code><a href="https://raw.githubusercontent.com/aks-builds/quality-skills/main/skills/mutation-testing/SKILL.md" target="_blank" rel="noreferrer">https://raw.githubusercontent.com/aks-builds/quality-skills/main/skills/mutation-testing/SKILL.md</a></code></li>
        </ul>
        <p><em>偏知识手册</em>，写得像一份可以照着讲的规范：</p>
        <ul>
        <li>把结果定义成 4 态：<code>Killed</code> / <code>Survived</code> / <code>No coverage</code> / <code>Timeout</code>；</li>
        <li>给了一个 <u>100% 行覆盖但测试无效</u> 的反例（<code>assert discount(100, True) is not None</code>）；</li>
        <li>列出 <u>9 类变异操作符</u>（算术 / 条件 / 布尔 / 常量 / 返回 / 分支 / 方法调用移除 / 自增自减 / 取负）；</li>
        <li>按语言推荐工具（Java PITest 称为 gold standard，Python 提 mutmut 与 Cosmic Ray，Go 提 go-mutesting 与 gremlins.dev）；</li>
        <li>给出 <u>7 条常见坑</u>，其中最关键的两条是：<strong>别把 mutation score 当发布门禁</strong>（追 100% 会写出过度特化、重构即碎的测试），以及<strong>别在没覆盖的代码上跑</strong>。</li>
        </ul>
        <p>它的 <code>description</code> 写得非常克制，明确划界：「行覆盖率看 code-coverage，整体策略看 test-strategy」——<em>这正是 skill 该有的写法</em>。</p>
        <h3>2.2 MCP Server（<u>2 个</u>，一可用一已失效）</h3>
        <p>#### ① <code>mutmut-mcp</code> — 可用（推荐）</p>
        <ul>
        <li>仓库：<code><a href="https://github.com/wdm0006/mutmut-mcp" target="_blank" rel="noreferrer">https://github.com/wdm0006/mutmut-mcp</a></code>（<code>git ls-remote</code> 通过，MIT）</li>
        <li>原始 README 已读全文核实</li>
        <li>工具数：<u>13 个</u>（<code>run_mutmut</code> / <code>start_mutmut_run</code> / <code>mutmut_run_status</code> / <code>cancel_mutmut_run</code> / <code>show_results</code> / <code>show_survivors</code> / <code>rerun_mutmut_on_survivor</code> / <code>clean_mutmut_cache</code> / <code>show_mutant</code> / <code>mutant_context</code> / <code>prioritize_survivors</code> / <code>mutation_score</code> 等）</li>
        <li>关键设计（对 agent 特别友好）：</li>
        <li><code>mutant_context</code> 返回 <code>&#123;mutant_id, diff, tests, message&#125;</code>——<strong>直接告诉你哪个用例覆盖了这个变异体</strong>，<code>tests</code> 为空即「没有任何测试覆盖它」；</li>
        <li><code>prioritize_survivors</code> 按「重要性」排序存活变异体，agent 不用自己排优先级；</li>
        <li>后台运行 + 取消 + 状态查询，适合放进长任务循环；</li>
        <li>跨进程文件锁 <code>.mutmut-mcp.lock</code>，并发调用返回 busy 而非搞坏 mutmut 状态。</li>
        <li><em>安装方式</em>（<strong>npm 上没有这个包</strong>，<code>npm view @wdm0006/mutmut-mcp</code> 返回 <u>404</u>，必须走 git 源）：</li>
        </ul>
        <pre data-lang="json"><code>&#123;
          "mcpServers": &#123;
            "mutmut": &#123;
              "command": "uvx",
              "args": ["--from", "git+https://github.com/wdm0006/mutmut-mcp", "mutmut-mcp"]
            &#125;
          &#125;
        &#125;</code></pre>
        <ul>
        <li>它自己的 CI 用变异测试测自己（<code>source_paths = ["mutmut_mcp.py"]</code>），并对「未检出变异体数」设了硬预算，超了就红。<em>这条自证实践本身就说明作者懂变异测试的正确用法</em>——不是拿分数当 KPI，而是拿「漏网变异体数」当回归闸门。</li>
        </ul>
        <p><strong>本机安装实测（2026-11-12，已通过）</strong>：</p>
        <pre data-lang="powershell"><code>uvx --from git+https://github.com/wdm0006/mutmut-mcp python -c "import mutmut_mcp; print(mutmut_mcp.__file__)"
        # → IMPORT_OK C:\Users\yuhang\AppData\Local\uv\cache\archive-v0\dGr4uVloWLAI4-2p\Lib\site-packages\mutmut_mcp.py</code></pre>
        <p><em>注意</em>：直接跑 <code>uvx ... mutmut-mcp</code> 会<strong>挂住不返回</strong>——这是 stdio MCP server 的正常行为（它启动后等待 stdin 上的 JSON-RPC），不是安装失败。首次拉取 + 构建耗时会明显长于后续（本次首次约 <u>3 分钟</u>内完成导入）。</p>
        <p>#### ② <code>test-trust</code> — 已失效，不要照抄安装</p>
        <ul>
        <li>登记在 Glama / HiMCP（快照日期 <u>2026-08-20</u>，README 全文可读）</li>
        <li><strong>但 <code><a href="https://github.com/rrudy9/test-trust" target="_blank" rel="noreferrer">https://github.com/rrudy9/test-trust</a></code> 在 <u>2026-11-12</u> 核验为 GitHub「Page not found」</strong>，<code>git ls-remote</code> 同样返回 <code>Repository not found</code></li>
        <li>目录站快照里描述的功能（若仓库恢复则值得参考）：以 git diff 变更行为中心做<strong>作用域限定</strong>，只对改动函数做变异测试；把结果聚合成一个 per-function 的 <strong>trust score</strong>；支持 mutmut / StrykerJS / gremlins / cargo-mutants 四种引擎；附带 GitHub Action 在 PR 里评论「哪些函数的测试抓不住回归」</li>
        </ul>
        <p><em>给 agent 的启示仍然成立</em>：<strong>别再对整个仓库跑变异测试</strong>，只对 diff 涉及函数跑，再聚合成一个可信度分数——这与 <code>genotoxic</code> 的「增量 + 分诊」思路一致。</p>
        <h3>2.3 各语言官方/主流变异测试工具</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>语言</th>
        <th>首选工具</th>
        <th>备选</th>
        <th>备注</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>TypeScript / JavaScript</td><td><strong>Stryker</strong>（<code>@stryker-mutator/core</code>）</td><td>—</td><td>支持 Jest / Vitest / Mocha / Karma；支持 <code>--since</code> 增量</td></tr>
        <tr><td>Python</td><td><strong>mutmut</strong>（3.x）</td><td>pytest-gremlins</td><td>mutmut 3.x 命名形如 <code>mymodule.x_add__mutmut_1</code>，状态含 survived / no tests / timeout / suspicious / skipped / segfault</td></tr>
        <tr><td>Python（更快）</td><td><strong>pytest-gremlins</strong></td><td>—</td><td>用 mutation switching，不落盘不重载模块，需 Python 3.11+</td></tr>
        <tr><td>Rust</td><td><strong>cargo-mutants</strong></td><td>—</td><td><code>cargo mutants --json</code>，结果在 <code>mutants.out/outcomes.json</code></td></tr>
        <tr><td>Go</td><td><strong>gremlins</strong></td><td>go-mutesting</td><td><code>gremlins unleash .</code>；gremlins 有覆盖引导的精准选测</td></tr>
        <tr><td>Java / JVM</td><td><strong>PITest</strong></td><td>—</td><td>改字节码而非源码，因此快；HTML 报告</td></tr>
        <tr><td>C# / .NET</td><td><strong>Stryker.NET</strong></td><td>—</td><td><code>dotnet tool install -g dotnet-stryker</code></td></tr>
        <tr><td>C / C++</td><td><strong>Mull</strong></td><td>—</td><td>LLVM 插件式；<strong>二进制 LLVM 版本必须与本机 Clang 严格一致</strong></td></tr>
        <tr><td>Ruby</td><td><strong>mutant</strong></td><td>—</td><td></td></tr>
        <tr><td>PHP</td><td><strong>Infection</strong></td><td>—</td><td><code>infection-log.json</code></td></tr>
        <tr><td>Solidity</td><td><strong>slither-mutate</strong></td><td>—</td><td>15 个算子，按严重度级联；论文 arXiv:2006.11597</td></tr>
        <tr><td>Circom</td><td><strong>circomvent</strong>（Trail of Bits）</td><td>—</td><td>仓库需从源码克隆</td></tr>
        <tr><td>Cairo</td><td><strong>cairo-mutants</strong>（Trail of Bits）</td><td>—</td><td>同上</td></tr>
        <tr><td>Haskell</td><td><strong>MuCheck</strong></td><td>Hedgehog / QuickCheck 作性质测试代理</td><td></td></tr>
        </tbody>
        </table>
        </div>
        <h3>2.4 指南与配套工具</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>类型</th>
        <th>资源</th>
        <th>说明</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>单文件最佳指南</td><td>Trail of Bits <code>references/mutation-frameworks.md</code></td><td>13 语言安装 + 配置 + 结果解析 + necessist，本次已读全文</td></tr>
        <tr><td>互补工具</td><td><strong>necessist</strong>（<code>trailofbits/necessist</code>，<code>git ls-remote</code> 通过）</td><td>删测试语句再跑，通过即说明该断言无作用；支持 Go / Rust / Solidity / Hardhat / Vitest / Anchor</td></tr>
        <tr><td>代码图分析</td><td><strong>trailmark</strong></td><td><code>genotoxic</code> 的前置依赖，<code>uv tool install trailmark</code></td></tr>
        <tr><td>官方文档</td><td>StrykerJS 官方文档（<code>stryker-mutator/stryker-js</code>，仓库公开）</td><td>配置项与 mutator 列表以官方文档为准</td></tr>
        <tr><td>科普长文</td><td>worldprogramming.org「What is mutation testing?」</td><td>概念澄清用，含等价变异体与常见坑</td></tr>
        <tr><td>教程</td><td>pie.inc 博客「What Is Mutation Testing?」/ drizz.dev</td><td>偏 QA 团队视角</td></tr>
        <tr><td>榜单类</td><td>rottenwifi.com「Best Mutation Testing Tools」</td><td><em>营销站，含推广链接，仅作线索不作依据</em></td></tr>
        </tbody>
        </table>
        </div>
        <h3>2.5 本机现状（已核实）</h3>
        <ul>
        <li>本地 skill 目录 <code>C:\Users\yuhang\.minimax\skills</code> 共 <u>262 个</u>目录，全文检索 <code>mutation|mutant|变异测试|stryker|mutmut|pitest|metamorphic</code> → <u>0 命中</u>。</li>
        <li>已配置 MCP server <u>2 个</u>：<code>actor-critique-loop</code>（stdio / node）、<code>blender</code>（stdio / uvx）。无变异测试相关。</li>
        <li>环境侧：<code>uv</code> / <code>uvx</code> <u>0.12.5</u> 可用；<code>ffmpeg</code>（imageio-ffmpeg 内置）可用；<code>faster-whisper 1.2.1</code> 可用。</li>
        </ul>
        <hr />
        <h2>三、[判断与建议]</h2>
        <blockquote><p>以下为判断，非已核实事实。</p></blockquote>
        <h3>3.1 三条路线的取舍</h3>
        <p><strong>A. 直接抄 <code>genotoxic</code>（推荐给「想做事」的人）</strong></p>
        <p>它的价值不在「会跑 Stryker」——那部分十分钟就能学会——而在<strong>分诊 taxonomy</strong>：把「有 31 个存活变异体」这个数字，翻译成「这 3 个是真缺测试、这 2 个是等价变异体别管、这 5 个该上 fuzz」。<em>没有这一步，变异测试的产出就是一堆噪音，agent 会被淹没。</em></p>
        <p><strong>B. 只装 <code>mutmut-mcp</code>（推荐给「Python 项目 + 要接 agent」的人）</strong></p>
        <p><code>mutant_context</code> 返回的 <code>tests</code> 字段直接解决了 agent 最难的部分：<strong>该往哪个测试文件里补什么断言</strong>。配合 <code>prioritize_survivors</code> 的排序，agent 就有了一条「发现问题 → 定位文件 → 写用例」的闭环。</p>
        <p><strong>C. 什么都不装，自己写一个本地 skill</strong></p>
        <p>如果目标是把变异测试固化进 <code>C:\Git-repo-my\个人成长</code> 的工作流，且主要语言不是 Python，那么自建更实际——因为 <code>mutmut-mcp</code> 只覆盖 Python，而 <code>genotoxic</code> 依赖 <code>trailmark</code> 这类额外工具链。</p>
        <h3>3.2 落地时最容易踩的三个坑（三个 skill 都反复强调）</h3>
        <ol>
        <li><em>别把 mutation score 当发布门禁</em>。<code>aks-builds</code> 与 <code>adiomas</code> 在这点上直接对立：<code>aks-builds</code> 说「发布门禁通常是坏主意」，<code>adiomas</code> 说「关键路径 <u>80%</u> 阻断」。<strong>我的判断</strong>：两者都对，但适用面不同——门禁只适合 auth / payment / parser 这类高风险模块，其余模块应当作为<strong>缺口发现器</strong>而非闸门。<code>mutmut-mcp</code> 作者自己的做法最值得抄：卡的是「漏网变异体<strong>数量</strong>」，不是「分数百分比」。</li>
        <li><em>必须先有行覆盖率基线</em>。在没被覆盖的代码上跑变异测试，得到的是一堆 <code>NoCoverage</code>，没有信息量。</li>
        <li><em>等价变异体会污染信号</em>。<code>assert x is not None</code> 这类断言在任何变更下都通过，等价变异体是变异测试的固有噪音，必须人工分诊掉，否则会把分数压到没有指导意义。</li>
        </ol>
        <h3>3.3 给「让 agent 写测试」这个场景的补充判断</h3>
        <p>原片讲的是给 agent 更硬的反馈信号，这一点比「测试质量」本身更重要。但视频页的一条高赞评论提出了一个真实的反例，值得记下来：</p>
        <blockquote><p>有开发者反馈，agent 写的测试往往测的是<strong>实现</strong>而不是<strong>功能需求</strong>，变异测试反而会把这个坏倾向<strong>放大</strong>——因为变异体都是对着实现细节生成的，agent 会被引导去补一堆「锁死实现」的断言。他自己的做法是 review PR 时把 <u>40 个测试减到 12 个高质量测试*。</u></p></blockquote>
        <p><em>这是本次调研中唯一一个「变异测试可能有害」的一手证据</em>。它的推论是：<strong>变异测试该用在「人写的需求驱动的测试」上做验收，而不是用来指导 agent 生成新测试</strong>——或者反过来，用它做<strong>减法</strong>（找出哪些测试是空转的），比用它做加法更安全。</p>
        <h3>3.4 未覆盖的盲区</h3>
        <ul>
        <li>原片完整版未下载，agent 工作流的完整论述缺失。</li>
        <li>三个 skill 均未在本机实测运行，只做了原文阅读与仓库可达性核验。</li>
        <li><code>test-trust</code> 的原始源码已不可访问，其实现细节（trust score 具体算法）<strong>未经核实</strong>，上表描述来自目录站快照，<strong>仅供参考</strong>。</li>
        <li>未调研 mutation testing 在 RAG / 训练数据构建上的用法（与本机 day-job 的 LLM 语料方向可能相关，但本次未展开）。</li>
        </ul>
        <hr />
        <h2>四、表格总结：</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>选项</th>
        <th>代价</th>
        <th>影响</th>
        <th>ROI</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><strong>我1</strong>：装 <code>mutmut-mcp</code>（uvx + git 源）到本机 MCP</td><td><u>约 3–15 分钟</u>安装配置（首次拉取构建较慢，已在本机实测通过）；仅覆盖 Python 项目</td><td>agent 立刻拿到「变异体 → 覆盖它的用例」映射，可闭环补测试；<u>13 个 MCP 工具</u>可用</td><td>投入 1 次安装；产出：每次跑变异测试省掉手工解析 JSON 与排序存活项（估算省 <u>30–60 分钟</u>/次）；回收周期 <u>首次跑完即回本</u></td></tr>
        <tr><td><strong>我2</strong>：把 <code>genotoxic</code> 的 taxonomy + 13 语言对照表落成本地 skill</td><td><u>约 1–2 小时</u>改写落盘；需补本机路径与命令</td><td>跨语言可用；把「存活变异体」变成可执行的补测/fuzz 清单，而非噪音数字</td><td>投入一次性改写；产出：每个项目的变异测试产出从「不可用数字」变成「可执行工单」；回收周期 <u>第 2 次使用时回本</u></td></tr>
        <tr><td><strong>你1</strong>：仅在 auth / payment / parser 等高风险模块按需跑，人工分诊</td><td>几乎为零（用现成工具）</td><td>见效慢但风险最低；符合三个 skill 的共同告诫「别当门禁」</td><td>投入 每次 <u>10–30 分钟</u>；产出：抓住 <u>1 个</u>真实回归即回本；回收周期 <u>即时</u>（但覆盖范围有限）</td></tr>
        <tr><td><strong>你2</strong>：把变异测试接进 CI 做发布门禁</td><td>需 CI 改造 + <u>数倍</u>测试时长 + 分数治理成本</td><td>风险最高：易产出过度特化测试、拖慢流水线、诱发「刷分」行为</td><td>投入 <u>以周计</u>；产出：不明确的长期质量收益；回收周期 <u>不可估算</u>（不建议）</td></tr>
        </tbody>
        </table>
        </div>
        <hr />
        <h2>附录 A：本地转写全文（ASR 输出，已纠正术语）</h2>
        <pre><code>[0.00-3.44]  有高品质的测试组合是重要的
        [3.44-6.72]  但是你怎么知道你的测试组合能够成功呢?
        [6.72-8.52]  有一个方法可以改善你的测试组合
        [8.52-11.12] 就是用它进行变化测试        → 变异测试
        [11.12-14.72] 变化测试会看出你的原则       → 源码
        [14.72-16.40] 它会进行变化                 → 施加变异
        [16.40-18.84] 在这里,它改成了Java String
        [18.84-20.00] 它就会变成一个空空的 String
        [20.00-22.28] 然后它会重新进行测试
        [22.28-24.00] 看看你的测试会否失效
        [24.00-26.68] 每个变化测试的变化           → 每个变异体
        [26.68-29.04] 都是一个生存的变化           → 存活变异体
        [29.04-31.16] 需要被杀死的变化             → 被杀死变异体
        [31.16-33.88] 这给你的测试员很豪华的信息
        [33.88-36.12] 关于测试员的测试效果
        [36.12-37.36] 你会发现测试员的测试效果
        [37.36-40.00] 会更加厉害
        [40.00-41.72] 你会知道每个测试员
        [41.72-44.24] 都在捕捉你系统的有可能变化
        [44.24-45.84] 所以我非常喜欢变化测试
        [45.84-47.32] 我建议大家
        [47.32-51.04] 有点害怕测试员的测试效果    → 机器音轨在此不可靠
        [51.04-53.04] 在这里,我使用striker.js
        [53.04-54.08] 来写写字
        [54.08-55.84] 但是有很多选项
        [55.84-57.60] 根据你正在工作的语言</code></pre>
        <h2>附录 B：素材清单</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>文件</th>
        <th>大小</th>
        <th>说明</th>
        </tr>
        </thead>
        <tbody>
        <tr><td><code>BV1PQxk6fES8.mp4</code></td><td><u>3.5 MB</u></td><td>已合流视频（480×854 竖屏，含中文配音）</td></tr>
        <tr><td><code>audio_16k.wav</code></td><td><u>1.8 MB</u></td><td>16 kHz 单声道，供 ASR</td></tr>
        <tr><td><code>transcript.txt</code> / <code>.srt</code> / <code>.json</code></td><td><u>1.2–2.8 KB</u></td><td>转写三件套（含时间轴）</td></tr>
        <tr><td><code>meta.json</code></td><td><u>2.5 KB</u></td><td>bvid / cid / 标题 / 时长 / 流信息</td></tr>
        <tr><td><code>frames/f_01…f_06.png</code></td><td>6 张</td><td>关键帧（间隔 9 秒）</td></tr>
        <tr><td><code>fetch.py</code> / <code>asr.py</code></td><td>—</td><td>可复跑的下载与转写脚本</td></tr>
        </tbody>
        </table>
        </div>
        <hr />
        <blockquote><p>免责声明：本输出由 AI 辅助生成，仅用于信息整理与研究参考，不构成专业意见或决策依据。</p></blockquote>
      </>
    ),
  },
  {
    slug: "ue5-lighting",
    title: "UE5 游戏光照设计 · 内容地图与三讲讲义",
    date: "2026-11-12",
    authors: "Hang Yu",
    tags: ["UE5", "光照设计"],
    body: (
      <>
        <blockquote><p>素材事实与知识点清单。PPT / 口播 / skill 三类交付物共用这一份底稿。</p></blockquote>
        <h2>一、素材事实（已核实）</h2>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>项</th>
        <th>值</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>短链</td><td><code><a href="https://b23.tv/ZTsZW55" target="_blank" rel="noreferrer">https://b23.tv/ZTsZW55</a></code></td></tr>
        <tr><td>落地页</td><td><code><a href="https://www.bilibili.com/video/BV17Eeq6sEMY/" target="_blank" rel="noreferrer">https://www.bilibili.com/video/BV17Eeq6sEMY/</a></code></td></tr>
        <tr><td>BV 号</td><td><code>BV17Eeq6sEMY</code></td></tr>
        <tr><td>UP 主</td><td>ChyiZ_（搬运）</td></tr>
        <tr><td>原始出品</td><td>Vertex School · 讲师 Maria（Deviation Games 首席灯光艺术家）</td></tr>
        <tr><td>总时长</td><td>7314 秒（<u>2 小时 2 分</u>）</td></tr>
        <tr><td>分P 数</td><td>6</td></tr>
        </tbody>
        </table>
        </div>
        <h3>分P 结构（关键：有一半是重复）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>P</th>
        <th>时长</th>
        <th>标题</th>
        <th>性质</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>P1</td><td>870s</td><td>UE5游戏光照设计 \</td><td>室内外布光/... （标题被设为总标题）</td><td>= A01 入门介绍，<strong>与 P4 字节数完全相同（5220491 B）</strong></td></tr>
        <tr><td>P2</td><td>1693s</td><td>【国语】A 02 理论介绍_dub</td><td>A02 的国语配音版</td></tr>
        <tr><td>P3</td><td>1094s</td><td>【国语】B 01 1.0 外景基础（一）_dub</td><td>B01 的国语配音版</td></tr>
        <tr><td>P4</td><td>870s</td><td>【原声】A 01 入门介绍_sub</td><td>A01 原声版</td></tr>
        <tr><td>P5</td><td>1693s</td><td>【原声】A 02 理论介绍_sub</td><td>A02 原声版（与 P2 差 216 字节）</td></tr>
        <tr><td>P6</td><td>1094s</td><td>【原声】B 01 1.0 外景基础（一）_sub</td><td>B01 原声版（与 P3 差 216 字节）</td></tr>
        </tbody>
        </table>
        </div>
        <p><strong>去重后真实课程内容只有 3 节</strong>：</p>
        <ol>
        <li><strong>A01 入门介绍</strong>（870s / 14.5 分）— 导论，讲师背景 + 三件工具（DaVinci Resolve / Pinterest / PureRef）+ 课程定位（技术 50% / 艺术 50%）</li>
        <li><strong>A02 理论介绍</strong>（1693s / 28 分）— 全课方法论核心，数字照明 vs 现实照明、光源类型、GI、两小时核心目标</li>
        <li><strong>B01 1.0 外景基础（一）</strong>（1094s / 18 分）— 第一个动手环节，UE5 外景系统搭建 + 项目检查 + 曝光钩子</li>
        </ol>
        <h3>缺口（必须向用户说明）</h3>
        <ul>
        <li>标题写「9h 实战」，B 站实际只上传了 <u>1 小时</u> 的 3 节内容，是完整课程的第一部分（B01 结尾明确说「下期见，我将讲解 24 小时昼夜光照」）。</li>
        <li>因此「每节课都做」= 3 套交付物，不是 9 套。</li>
        <li>版权：这是付费课程（Vertex School）的搬运版。交付物按「学习笔记 / 知识点重制」定位，不整段搬运视频画面与讲师原声，转写文本仅作本地语料，不外发。</li>
        </ul>
        <h2>二、知识点清单（按课节）</h2>
        <h3>A01 · 入门介绍（技术密度：低）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>#</th>
        <th>知识点</th>
        <th>可讲性</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>1</td><td>讲师履历：育碧上海（Far Cry 4 / Primal / Valley of the Yetis）→ Crytek（Robinson: The Journey / The Climb）→ Cloud Imperium（Star Citizen）→ Splash Damage（Gears 5）→ Deviation Games 首席灯光艺术家</td><td>低（人设页）</td></tr>
        <tr><td>2</td><td>课程定位：50% 技术 + 50% 艺术；目标是「用光讲故事」而非纯技术</td><td><strong>高</strong>（课程声明）</td></tr>
        <tr><td>3</td><td>三件工具：DaVinci Resolve（免费版做调色/HDR）、Pinterest（图像搜索引擎找灵感）、PureRef（情绪板 overlay）</td><td>中</td></tr>
        <tr><td>4</td><td>学习前置：每周练习量、视觉训练优先于软件训练</td><td>中</td></tr>
        </tbody>
        </table>
        </div>
        <h3>A02 · 理论介绍（技术密度：高，是全课枢纽）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>#</th>
        <th>知识点</th>
        <th>关键结论</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>1</td><td><strong>附加法照明（additive lighting）</strong>：数字照明是「拖几个光源进去」，现实照明是「一个太阳 + 无数次反弹」</td><td>认知起点</td></tr>
        <tr><td>2</td><td><strong>数字照明四大组件</strong>：Directional Light（主光，90% 室外场景）、Skylight（辅助/环境）、Point Light（点光，室内基础照明）、Spot Light（游戏里最常用）</td><td>光源选型口诀</td></tr>
        <tr><td>3</td><td><strong>Rect Light（区域光）</strong>：游戏里慎用，因为 Lumen 已处理 GI 与反射；滥用会出现「方形光源」人造感。只在特写、资产审核、柔面材质时用</td><td>反直觉结论，值得单页</td></tr>
        <tr><td>4</td><td><strong>GI 演进</strong>：UE4 混合工作流 = 烘焙 lightmap / volumetric lightmap → UE5 = Lumen 实时 GI</td><td>版本分水岭</td></tr>
        <tr><td>5</td><td><strong>衰减（falloff）</strong>：亮度从光源核心到边缘渐弱；点光衰减低、覆盖广，是最适合室内基础照明的光源</td><td>参数直觉</td></tr>
        <tr><td>6</td><td><strong>三光源法</strong>：key light（塑形 + 覆盖）、back light（游戏里多由 GI/Skylight 代劳）、ambient（点光）</td><td>与摄影棚对应</td></tr>
        <tr><td>7</td><td><strong>游戏照明 vs 电影照明</strong>：电影是固定机位、可无限打磨；游戏要覆盖玩家所有可能视角，首要目标是<strong>可见性</strong></td><td>职业认知</td></tr>
        <tr><td>8</td><td><strong>两大核心目标</strong>（全课最重要的一句）：① 展现关卡最理想形态；② <strong>引导玩家视线</strong></td><td>可作为全课标题页</td></tr>
        <tr><td>9</td><td><strong>参考图分类法</strong>：材质参考图（标准曝光、看清质感）vs 氛围参考图（长曝光 / 后期调色、看光线与空间）</td><td>可直接做成对照页</td></tr>
        <tr><td>10</td><td><strong>直接光 vs 间接光</strong>：裸光源（太阳、无罩灯泡）vs 经介质散射的柔光（灯罩、纸灯笼）；公共空间优先间接光</td><td>生活观察法</td></tr>
        <tr><td>11</td><td><strong>第一周练习</strong>：不碰引擎，出门拍光 —— 观察窗框/墙壁在一天中的变化，判断直接光 / 间接光</td><td>可执行作业</td></tr>
        <tr><td>12</td><td><strong>霓虹灯禁令</strong>：开课阶段禁止用霓虹灯，因为未掌握色彩理论前的「直觉用色」会掩盖对光的基本理解</td><td>教学法观点</td></tr>
        </tbody>
        </table>
        </div>
        <h3>B01 · 1.0 外景基础（一）（技术密度：高，全实操）</h3>
        <div className="article-table-wrap">
        <table>
        <thead>
        <tr>
        <th>#</th>
        <th>知识点</th>
        <th>操作要点</th>
        </tr>
        </thead>
        <tbody>
        <tr><td>1</td><td><strong>UE5 全实时光照</strong>：不再需要烘焙 lightmap，但混合工作流的知识仍有重叠</td><td>观念转换</td></tr>
        <tr><td>2</td><td><strong>默认关卡清理</strong>：删掉 Reflection Capture（基于 SSR 的旧方案）、BP_Sky_Sphere、Atmospheric Fog</td><td>第一步动作</td></tr>
        <tr><td>3</td><td><strong>外景三件套</strong>：Sky Atmosphere + Skylight + Directional Light，缺一不可，是一个联动系统</td><td>系统观</td></tr>
        <tr><td>4</td><td><strong>Atmosphere Sun Light 开关</strong>：Directional Light 上必须勾选，否则 Sky Atmosphere 完全不显示</td><td>最高频踩坑，值得单独一页</td></tr>
        <tr><td>5</td><td><strong>项目自检三件</strong>：① 显卡支持光追 ② RHI 显示 DirectX 12（低于 11 无光追）③ Project Settings 里 Lumen 已启用</td><td>上手前检查表</td></tr>
        <tr><td>6</td><td><strong>Lumen 两种追踪模式</strong>：Detail Tracing（小场景、网格密集、交互多）vs Global Tracing（大场景、街道、景观）选错会崩或加载困难</td><td>决策表</td></tr>
        <tr><td>7</td><td><strong>反射必须与 GI 一致</strong>：GI 选 Lumen，反射方式也要选 Lumen，因为 SSR 已被取代</td><td>一致性</td></tr>
        <tr><td>8</td><td><strong>Auto Exposure Histogram + Extend default luminance range</strong>：初学者先别开，等做完一个项目再开；开了才有 Cine Camera 的手动曝光（DoF、快门）空间</td><td>分阶段建议</td></tr>
        <tr><td>9</td><td><strong>Shift+V = Visualize HDR and Adaptation</strong>：看曝光直方图，判断曝光是否合理</td><td>快捷键</td></tr>
        <tr><td>10</td><td><strong>Skylight 的 Static / Dynamic</strong>：默认 Static（固定），实时场景必须改 Dynamic/Movable</td><td>必改项</td></tr>
        <tr><td>11</td><td><strong>Recapture（重新捕捉）</strong>：Skylight 改了太阳角度后必须 Recapture，否则「场景突然变色」的怪异现象；实时捕捉（Real Time Capture）在游戏里太贵，不推荐</td><td>高频困惑点</td></tr>
        <tr><td>12</td><td><strong>下一节钩子</strong>：24 小时昼夜光照的正确设置</td><td>承上启下</td></tr>
        </tbody>
        </table>
        </div>
        <h2>三、贯穿全课的三条主线（做 skill 时的骨架）</h2>
        <ol>
        <li><strong>可见性优先于美感</strong> —— A02 反复强调，直接决定布光决策顺序。</li>
        <li><strong>光是有方向的叙事</strong> —— 引导玩家视线是第二个核心目标。</li>
        <li><strong>先训练眼睛，再训练软件</strong> —— A02 第一周作业、霓虹灯禁令都是这条的推论。</li>
        </ol>
        <h2>四、待用户确认（阻塞项）</h2>
        <ol>
        <li>交付范围：3 节（去重）还是 6 个分P 全做</li>
        <li>「PPTXQ」具体指哪种格式</li>
        <li>「HTSMP4 single HTML」具体指哪种交付</li>
        <li>「5 个 skill」的拆分口径</li>
        </ol>
        <h2>A01 入门介绍 · 逐字转写</h2>
        <ul>
        <li>来源：B站 BV17Eeq6sEMY P1（= P4 原声版，字节数完全相同）</li>
        <li>时长：870s（14 分 30 秒）</li>
        <li>讲师：Maria（Vertex School），Deviation Games 首席灯光艺术家</li>
        <li>性质：课程导论 / 招生说明，技术密度低</li>
        <li>转写工具：matrix listen_audio，2026-11-12</li>
        </ul>
        <hr />
        <p>大家好，我是 Maria。这将会是我在 Vertex School 的第二次亮相。</p>
        <p>因为我已经开设虚幻引擎灯光课程有一段时间了。应该是从三年前开始的吧。当然，最新的技术总是由 Epic Games 不断推陈出新的。正因如此，我决定对我的之前的灯光基础课程进行重置。</p>
        <p>在本次介绍中，我会简要介绍一些课程内容，希望大家能感兴趣看看。在报名我的课程之前，请务必先确认这一点。首先，如果您已经修过我在 Vertex 开设的灯光基础课程，这门课程属于更升级的版本，因为其中会涉及更多软件操作。其次，大部分课程模块的结构仍会与我之前的课程保持一致。如果您不确定的话，或者您之前从未听说过我的课程，这里有之前在 Vertex 发布的课程结构链接。可以直接联系任何工作人员，我相信他们一定会为您解答疑惑。</p>
        <p>这是我之前制作的课程内容，但请注意，这个课程可能仍在 Vertex 平台提供。而且这门课程是用虚幻引擎 4 制作的。所以我制作这个教程时，虚幻引擎 5 还没上市。这就是第一点要说明的。</p>
        <p>让我们再回顾一下我的自我介绍。我叫 Maria。目前我在圣莫尼卡的 Deviation Games Studio 担任首席灯光艺术家。这是我的艺术创作工作台。很可能在观看这门课程之前，大家就已经看过我的作品了。如果是初次了解我的人，我先向你们致以诚挚的问候。</p>
        <p>在我的艺术工作站展示的作品中，除了我之前参与开发的那些游戏作品外，比如《孤岛惊魂》、《鲁滨逊：大冒险》以及《战争机器》，那些更多属于游戏开发与工作相关的内容。但作为一名艺术家，我真正享受的是通过个人作品来创作并表达自己的想法。所以你们可能会发现，我这里展示的大部分作品都是我业余时间创作的。可以肯定的是，这对我而言是最佳方式。而通过分享自我，我觉得这是最有效的参与与学习方式。我真的很享受表达自己的创意。</p>
        <p>除此之外，我想大家应该都已经了解我了。因为工作关系，我从英国搬到了美国。所幸在疫情期间制片厂终于接纳了我。</p>
        <p>那么在这里，所有报名参加这门课程的人，或是打算报名的人都可以——如果我没猜错的话，我的大多数学生都是来自大学之外的新人，或者你已经身处这个行业，正在寻求更多关于灯光的知识，那么这门课程可能适合你。我之前那届班上也遇到过几位学生，他们表示要从其他行业转行。但实际上他们大多都具备一些摄影基础，或者他们很喜欢制作游戏艺术，只是完全不知道该从何下手。</p>
        <p>所以在决定是否加入我的课程之前，还有一件事我必须特别明确说明：我会为这门课程录制视频，因为我目前在美国的一家工作室全职工作。根据美国移民法规，我无法亲自指导大家。所以我请几位业内值得信赖的朋友来帮忙，他们会协助我带领大家完成这门课程。在录制过程中我会提供完整的操作指导，大家还能看到我完成整个过程的完整过程。请确保如果您需要面对面的指导，那我只会出现在这门录播课程中。</p>
        <p>最后，我想让各位获取一些免费工具。它们会在您的学习过程中提供很大帮助。因为我之前也一直向我的学生推荐这些工具。</p>
        <p><strong>工具一：DaVinci Resolve</strong>。行业标准的视频剪辑与调色软件。如果仅用于非商业用途，它是完全免费的。它主要用途是调色以及影片的剪辑与编辑。所以我强烈建议你去了解一下它。在课程学习期间，我会分享很多关于那些在调色方面教学极为出色的调色师职业的链接，而这也是我们后期制作内容的一部分。此外，我们还会简单介绍高动态范围成像流程（HDR）。因为在不同的色彩空间下往往需要做出很多妥协。</p>
        <p><strong>工具二：Pinterest</strong>。它实际上是一个免费的网站。按我的理解，它算不上真正的工具。这就是 Pinterest。我从来都不喜欢那些满屏弹出的广告。另外需要说明的是，我们要使用的这些软件我都没有从中获取任何佣金。因为那些都只是我的个人经验而已，所以我更倾向于用这两个平台来收集灵感。</p>
        <p>简单来说，如果你之前从未用过 Pinterest，它其实是一个图像搜索引擎。所以如果你有了某些标题之类的内容，通过这里进行搜索，对我来说是最合适的选择，同时也能收集一些初步的灵感。这样我就能很快在我的灯光设计板上展示其中一些内容。</p>
        <p>当然，如果你的目标是打造特定风格的作品，ArtStation 绝对是绝佳的选择。但这属于另一个选择，旨在让不同媒介的内容相互交叉参考，不必总去查看 3D 艺术作品。这样你就不用一直去浏览 3D 艺术内容了，概念艺术或游戏艺术作品。因为在这里你很可能找到摄影作品的商业封面。此外，还有电影截图任你挑选。所以，我觉得这是个收集灵感的绝佳平台。但如果你在寻找高清高端图像的话，这里并非最佳选择。</p>
        <p><strong>工具三：PureRef</strong>。如果你们打算使用 PureRef 的话，就能看到里面的内容会实时变化。你们要做的就是下载它。虽然他们确实会要求捐赠，但直接选择自定义金额应该就没问题。</p>
        <p>所以大家，这就是我希望你们提前准备好的三款基础工具，在加入照明训练营之前。</p>
        <p>对了，我忘了做自我介绍了。大概从 2013 年开始，我就一直从事视频游戏灯光艺术师的工作。我的第一份工作是在育碧上海分公司。在参与了三部《孤岛惊魂》系列游戏之后，我是该系列的最后一部《孤岛惊魂 4》开发阶段加入的。之后我还参与了《雪人谷》的 DLC 制作。在离开育碧之前，我还参与了《孤岛惊魂：原始》的开发工作。此外，我还负责了该游戏的首个引导任务。</p>
        <p>之后，我离开了中国前往德国发展。我在 Crytek 法兰克福工作室工作了近一年时间。我们成功推出了两款 PlayStation VR 游戏，分别是《鲁滨逊：大冒险》和《The Climb》。之后我又被调到了英国，因为我之前在那里毕业，并且返回英国学习美术与舞台设计。之后我在两家英国工作室工作过。其中一家就是 Cloud Imperium Games，他们就是最著名的众筹游戏之一《星际公民》的开发者。在这之后大家应该会看到《战争机器 5》，那是我在 Splash Damage 工作的地方。我还结识了很多朋友，而且在那里交到了几乎可以相伴一生的挚友。</p>
        <p>我其实是几个月前才从英国搬到美国的。我到现在还在布置家居，所以你们可以看到我的住处还挺空的。但在游历了三个国家之后，我确实很享受分享自己的经历和想法。</p>
        <p>所以再次告诉大家，如果你进入游戏行业是想从事灯光艺术师的工作，这门课程非常适合你。请把这里视为一间初创公司。我会讲解很多与艺术相关的内容。不过，我们也会涉及不同的工作流程。因为你需要掌握那些相关概念，同时还需要知道如何进行管理以及如何一步步完成你的项目。</p>
        <p>因此，在授课过程中我会讲解大量基础的知识点。包括不同的亮度设置，还有亮度单位以及如何将实际数值导入 Unreal 引擎。而且更具实用性。我们讲解如何处理物理材质与非物理材质。但就像我之前说的，并非完全侧重技术内容。我终究还是个艺术家，所以我更喜欢直接表达想法。</p>
        <p>有一件事能让我的课程脱颖而出，比其他同类教程更胜一筹。目前已经有许多才华横溢的灯光艺术家在制作技术含量极高的教程。我的课程内容将一半是技术知识，一半是艺术技巧。所以如果您正在寻找高强度的技术培训，或是关于如何使用这款工具的指导，那我建议对于您来说虚幻引擎相关或类似高度侧重技术的教程会比我的课程更合适。但如果您真正想要了解如何最有效地运用这款工具，以及如何构建完整的叙事与创意故事，运用您的灯光设计技能来表达想法，讲述故事并打造出脱颖而出的作品集，我非常有信心能够帮助您做到这一点。因为这正是我的强项。</p>
        <p>在结束这次介绍之前，请允许我先做个说明，我的博客上的 ArtStation。你也可以查看往届学员所取得的成果。这里有他们所有的 ArtStation 链接，所以如果您不确定这门课程是否适合自己，欢迎随时联系我的往届学员。</p>
        <p>您会看到那些曾参加过我灯光训练营的往届学员的作品。其中藏着许多美好的回忆。因为我从事教学工作并非仅仅因为我擅长且热爱自己所做的事，与其说是在教学，不如说是在结识新朋友。我会聆听他们的人生故事，这也会给我带来很多正能量。</p>
        <p>没错，这些都是我之前的一些学生的作品。我在那边办了一个小型展览。他们中的很多人如今其头衔已变为艺术或灯光艺术家、环境艺术家甚至是渲染工程师。</p>
        <p>还有另一门课程，有很多来自 Vertex 的学生也向我咨询过。所以如果你进入我的应用站点，在进入商店页面就会发现有一门名为 Unreal Engine 高级光照设计的课程。对于那些正在寻找针对性培训的人士，我建议你们可以看看这门课程。但由于我是在搬家前才录制这段内容的，所以确实有点仓促。请注意，这就是那门课程。如果你是虚幻引擎的完全新手，我不会向你推荐它，只是因为我在制作这门课程时会说明它适合有一定基础的学习者。它更侧重于电影感画面与角色设计方面。关于优化的相关内容我几乎不会过多讲解，但我经常讲解的是如何构思创意。</p>
        <p>在购买之前还有一个视频，你可以通过链接找到它，所以一定要去看看，从而为自己做出最正确的决定。不过我和我们备受喜爱的 Vertex 工作室共同完成的成果，更像是我们来这里分享关于使用 Unreal Engine 开展创业的基础知识，借助 Unreal Engine 这一工具。如果你想从事灯光设计工作，我们还会简要介绍一些摄影和电影摄影的相关内容。</p>
        <p>因此，请将此课程视为兼顾技术（含 Unreal 引擎及物理灯光）与艺术（侧重叙事表达）的基础课两部分内容的课程，以及我将如何作为艺术家协助你们完成整个创意项目。希望这份介绍能让您在决定是否报名课程之前获得足够的信息。无论如何，我很期待在课堂上见到大家。再见。</p>
        <h2>A02 理论介绍 · 逐字转写</h2>
        <ul>
        <li>来源：B站 BV17Eeq6sEMY P2（【国语】版；P5 为同内容原声版）</li>
        <li>时长：1693s（28 分 13 秒）</li>
        <li>性质：理论课，技术密度高，是全课方法论核心</li>
        <li>转写工具：matrix listen_audio，2026-11-12</li>
        <li>注：转写为 ASR 原始结果，个别术语有误听（如「Omni」指点光源、「区域光」= Rect Light、「天光」= Skylight），整理稿已校正</li>
        </ul>
        <hr />
        <p>大家好，这是第一场课程，这也是我们的介绍环节，本次虚幻引擎 5 灯光训练营的内容。在开始讲解具体内容之前，我想进一步向大家说明，我建议大家在开始操作室内外灯光之前，先观看这场课程的原因。</p>
        <p>因此本课程既涵盖理论性的灯光设计知识，也包含实用的灯光操作技能，帮助大家将创意在虚幻引擎中实现。但在向大家展示如何将虚幻引擎 5 与 Lumen 结合使用以实现实时光照之前，我想要先再多解释一点相关内容：这些创意究竟源自何处。所以，无论您是出于进一步学习还是进一步实践的目的，我知道我们大多数人选择参加这门课程，都是因为您和我一样，有着相似的职业规划。您想成为游戏光效艺术家，或者您可能正在从事动画或环境艺术工作，希望进一步提升自己的光效技能。</p>
        <p>那么我首先想谈的是现实情况，也就是数字照明与现实生活中的照明之间的差异。我相信在参加我的课程之前，大家大多都已使用过或接触过相关软件，比如 Unreal、Unity、Maya、Arnold 之类的。我想大家应该都明白数字光是如何运作的。在数字照明领域，我们基本上采用的是附加法照明（additive lighting）。所谓附加法照明，就是我们可以直接拖入几种不同的光源资源。</p>
        <p>其实整个场景的渲染通常都是通过全局光照来实现的。这个参考资料是我从 CG Future 那里获取的，他们制作了一幅非常出色的图表，用来解释不同类型的光源。不过我相信大家都明白什么是数字照明或方向光。因为在 Unreal 引擎中，当我们谈论方向光（Directional Light）时，指的通常就是那种直接照射的光线效果。这类光线通常被用来模拟太阳或是月亮以及其他外部主光光源。正因如此，它才会影响整个场景的全局光照效果。它也会与天光（Skylight）协同工作。</p>
        <p>大家要注意哦，我们现在要采用实时光照的常规工作流程了。也就是说，即便已有方向光这样的主光光源，在整个场景中仍然需要一个辅助的光源，而在 Unreal 引擎中这个角色就是天光。所以通常我们需要方向光，天光与方向光共同作用，从而影响我们所处理的整个环境。至于它们将如何处理彼此之间的关联关系，那就是我们称之为全局光照（GI, Global Illumination）的解决方案。</p>
        <p>在数字照明领域，全局光照或许会是另一种解决方案。在旧版的虚幻引擎 4 中，如果采用混合工作流的话，我们之后会将全局光照信息烘焙到光照贴图（lightmap）或体积光贴图（volumetric lightmap）中。这就是其中一种方法。之后我们开始使用 Lumen 技术，因此 Lumen 就是虚幻引擎 5 提供的新型全局光照解决方案，而这正是我们将会使用的方案。</p>
        <p>在这段关于室内与室外照明的整个培训课程中，中间那三张图表里，它们基本上就是在说明——没错，我经常提到 Omni 这个词，在后续的照明操作讲解中你们也会听到它。但当我提到 Omni 时，只是因为那更像是一种舞台术语罢了。我原本来自舞台灯光和摄影领域，所以我已经习惯了使用这个词。不过这完全没有问题，你把它称作点光（Point Light），因为那本质上就是点光。</p>
        <p>至于 Unreal 引擎里的区域光，它有时被称作 Rect Light。所以如果你打开光源组件选择窗口，稍后我会给你演示，你会在那里看到各种不同的光照组件，其中之一就是区域光。在 Unreal Engine 中它有时也被称作 Rect Light。</p>
        <p>通常来说，这类光源在视频游戏的照明环境中，我们往往会非常谨慎地使用它们。因为对于区域光这一概念，我们有两个主要的用法。那就是将光源作为驱动光源时，此外我们还需要体积光照（Volumetric Lighting）功能，这也是其中一个术语。另一种用法则是我们可以为角色拍摄一些特写镜头，或者用类似的方式为资产审核提供预览，从而展现资产的最佳细节，或者用来展现极度哑光的材质。而为了呈现柔和的环境表面，就需要使用面光。但在游戏照明的大部分情况下，只要我们仔细计算，它完全可以被聚光灯替代。</p>
        <p>如果我们能认真地对其进行计算的话，再加上点光。聚光灯（Spot Light）和点光是我们一直在视频游戏照明领域采用的最常见的照明元素，或者说是该领域中最常被使用的照明工具。</p>
        <p>长话短说，通常在室内环境照明中，我们会使用点光作为基础照明光源。这类光线的衰减程度通常要低得多。如果你还不熟悉 Unreal 引擎的话，我所说的衰减（falloff），指的是半影强度会如何逐渐减弱的现象。简单来说，就是光线亮度会从光源核心逐渐衰减到光线覆盖范围的边缘。</p>
        <p>至于聚光灯，因为它具备可调节的光束宽度（cone angle）功能，它简直就像一只手电筒，而且如果调整光束宽度，它的照射范围也非常广。正因如此，它在实际应用中对场景和环境以及角色都有好处。因为在电子游戏领域里，我们必须考虑性能问题，同时还得确保光线能覆盖整个游戏区域。毕竟聚光灯的操控性极为出色，它的覆盖范围非常灵活。所以最终来看，我个人认为在视频游戏的数字照明领域，这是最常用的光源之一。也就是说它们就是两种最核心的光源。</p>
        <p>如果你能用点光实现某种特定的效果，那么对于聚光灯，我的建议是尽量避免使用区域光或是矩形光，因为我们已经用 Lumen 来处理全局光照问题了，而且 Lumen 还能负责处理反射效果。所以如果你使用大量区域光的话，或是矩形灯，你很有可能会看到方形光源的人造光效。因为比如说如果你要为科幻隧道布光，科幻隧道将会是我们室内照明部分里的示例之一。</p>
        <p>所以这是第一部分，我想带大家了解数字世界中不同类型的光。这类情况在现实世界中也确实存在。</p>
        <p>没错，下方有图表形式的说明，介绍我们是如何布置摄影棚灯光的，而这实际上就是我们拍摄照片的方式。所以如果你从事商业摄影相关工作，如果我们当中有人有摄影背景的话，在摄影棚里用于柔光箱（softbox）的光源，其实和用来为角色照明的区域光是完全相同的。所以无需多做解释，这张照片本身就能讲述一切。</p>
        <p>也就是说，我们准备了三组标准的点光或聚光灯组合。我们需要一盏点光来塑造物体轮廓，用于整体均匀照明。在电子游戏这类数字世界中，主光（key light）通常承担着塑造物体形态的功能，同时它还能为场景中的角色提供整体照明覆盖，或者说它能让玩家在场景中自由行走。正因如此，90% 的情况下主光都会是用于室外场景的方向光，也就是处于户外环境时，或是聚光灯。而若是室内场景，那就需要考虑背光（back light）了。</p>
        <p>在游戏照明中，背光其实是个概念相当模糊的元素。除非你是在进行渲染、预览之类的操作。你需要让角色处于良好的照明状态，同时背景中也需要一些光线信息。但在大多数情况下，背光效果是由我们的 GI 解决方案来处理的，也就是 Lumen 或天光，这取决于场景是室内还是室外。</p>
        <p>至于环境光（ambient light），在数字世界中，我们通常只使用点光。因为首先点光能覆盖所有空间维度，范围最广。别忘了 3D 世界本身就是三维的，角色可以在各个方向移动。从亮度效果来看，视频游戏的照明要求比电影或预渲染作品更为严格。因为在预渲染流程中，摄像机是固定的，我们有充足的时间来打磨细节，从而将画面品质提升到极高的水平。但就电影或预渲染作品而言，我们只需要考虑特定的拍摄角度即可。但在视频游戏中，尤其是《战地》或《使命召唤》这类多人游戏里则不然，我们得考虑所有可能的视角范围，基本上就是以玩家视野所能覆盖的范围为限。最好的解决方案就是找到合适的光照方案，以确保所有玩家都能拥有良好的视野。</p>
        <p>因为一旦游戏开始，情况就很难预料了。玩家会在哪里活动，通常会依据游戏场景区域来判定。只要设计师告知我们这是玩家会战斗的区域，无论是战斗、活动还是重生，这些区域都需做好照明处理。我们必须确保一定的能见度，这正是照明设计的核心要义。</p>
        <p>我知道你们很多人应该看过我的作品。在我的个人项目中，我确实喜欢打造美观的视觉效果，而且极具创意，比如注重场景的深度表现，但说实话，这份工作更侧重技术层面，而非艺术层面。</p>
        <p>业内通常遵循标准工作流程。因为我参与过多款 3A 级游戏的设计，比如《战争机器》、《孤岛惊魂》。尤其是《孤岛惊魂》，作为一款多人开放世界游戏，其照明的首要任务从来不是打造某个特定的美观角度，而是要找到一天中何时能确保最佳的可视效果，以及怎样的生效角度最能与体积雾效相配合，还有所有的光线散射效果。因为游戏里的照明本身就是游戏内容的一部分。</p>
        <p>各位，我希望大家都能牢记这一点。无论作品看起来多漂亮，照明设计都必须实用。而且照明必须能够保障一定的可视度，否则再美观的设计在实用性方面也毫无价值。</p>
        <p>就项目而言，如果要做外观精美的内容，确实需要两种不同的设计理念。在 Unreal 引擎中追求更高创意性的视觉效果用于个人作品完全没问题。不过各位要是正在学习这门课程，且目前准备求职、即将参加面试的话，面试官用游戏领域的术语询问你数字光效的原理，一定要确保自己理解到位。要强调的是，我们必须让游戏内容清晰可见，同时还要为玩家指引方向。这就是我欢迎大家加入我课程的第一个建议。</p>
        <p>接下来我们快速看一下，现实生活中的光线对比。那么寻找参考素材的最佳方法是什么？当然，我们会查看大量照片。不过这些照片有不同的类型。</p>
        <p>在左侧部分，我只是想向大家展示，这些照片都是我从 Pinterest 上下载的。但左边的那张更或多或少地展现出翻新后的场景。我觉得这里以前应该是工厂的一部分，后来这里就变成了植物园。那些照片都是用常规时间与标准曝光参数拍摄的，因此我们能够非常清晰地看清材质质地。如果我放大来看的话，就能判断出这是实体的物体，上面有一些分层设计的装饰物。这属于某种粗野主义建筑风格。</p>
        <p>这张照片并没有太多令人惊叹的效果，但它到底有什么用呢？它清晰地展现了所有的材质。这张照片算好照片吗？我认为是的，因为它的曝光很恰当，而且作为特写，它牺牲了背景的呈现，所以我们其实不会太关注背景。这就是我们所说的优质参考照片，用来查找各类材质或植被的时候。它的功能就是如此。</p>
        <p>但合适的照片本身也是一张图片。这张照片我记得是从某个夜间摄影或城市摄影网站上下载的。这里发生的情况是摄影师刻意使用了长曝光，再加上小光圈，从而获得极为清晰的图像。此外，它还突出了此处的所有的光线效果。如果我眯眼粗略对比，左边的照片噪点要多得多，但也包含了更多关于材质的信息。而右边的照片则清晰得多，非常干净。颜色则是通过后期处理刻意调整的，让画面更加平滑。因为从艺术家的创作目的来看，显然是为了突出光线与空间感，还有那些宏伟建筑的外观形态。</p>
        <p>这两种类型的画面表现方式能最好地展现差异。是解释 CGI 灯光与艺术灯光之间差异的最佳方式。所以只要存在表面，光线就会向各处反射，而且光线会以数千种不同的方式发生反射。这都是因为表面的粗糙度（roughness）所致。不过我们可以借鉴摄影领域的做法，运用后期处理、长曝光以及不同镜头等手段来实现我们想要的精准视觉风格。</p>
        <p>在 Unreal 中我们使用的是灯光工具，我们会不断调整材质，直到找到灯光与表面的最佳搭配。最后我们所有的后期处理工作都是在后期处理体积（Post Process Volume）中完成的。我们可以回溯整个流程，无论使用何种艺术媒介，处理流程始终如一。就像我们先布置灯光，再调整形状，最后确定视觉焦点一样。接着我们将色彩与材质结合在一起，以此呈现我们想要的精确视觉效果。</p>
        <p>那两张照片都很漂亮，不过我觉得其中一张的艺术感稍弱，但它依然带有某种后期处理痕迹，因为其对比度在我看来实在不真实。所以为了进一步凸显形状，它被大幅强化了处理。</p>
        <p>这也是我选择这两张照片的原因：就电子游戏照明而言，我们的职责不仅是确保可见性，我们还肩负着另一个极为重要的任务，那就是引导玩家。</p>
        <p>所以那两张照片上都有不少亮点。当你第一眼看到那些图片时，就能发现某些场景元素格外引人注目。所以左边的那张图里是走廊，还有站在那边的那个人。而这张图里则是天空和井，也就是从天花板延伸出的井状结构。它们都在为我们指引视线方向。就好像，一旦你成为舞台背后的灯光设计师，你就是那个要告诉观众或是玩家该往哪里看的人。</p>
        <p>长话短说，我可以将艺术灯光或电子游戏灯光设计总结为只有两个目的：我们展现了该关卡最理想的形态，从表面、质感、材质以及其他相关要素来看，就是要确保将空间处理得极为出色，让玩家能够清晰地看清布局。</p>
        <p>这些就是电子游戏照明设计的两大核心目标。</p>
        <p>我还有点额外的内容要讲。很久以前我写过一篇关于 XP-Point 的文章，我会把这篇文章的链接分享给大家，这样你们就能免费查看。我之前确实谈过关于理解外部环境的内容，还有 Unreal Engine 中的室内照明。也就是说我其实是把 Unreal Engine 当作 CGI 工具来使用，同时我会对比不同的照明条件，从中寻找创作灵感。</p>
        <p>这些其实是我用手机拍的一些照片，是在我开始创作《伦敦雾》这个作品之前拍的。这就是我结合所有参考资料完成的作品。如果感兴趣的话，不妨看一看。好了，回到我的灯光博客吧。</p>
        <p>大家随时欢迎阅读我的灯光日记，因为这基本上是我正在创作中的记录。</p>
        <p>那我们继续进行同行评审吧。我们刚才说到哪了？好的。第一周的任务就是练习，所有的人都要参与。我建议大家暂时先别碰 Unreal 引擎。在接下来的第二周和第三周，我们会重点关注这个问题。</p>
        <p>但目前我希望大家，这个周末出门的时候，或者去任何地方，要是进了咖啡店或是商店甚至是超市，都要留意周围的光源情况。</p>
        <p>因为我无法立刻给出详细的分析，那两张照片拍得如此出色，其实那两张并不是我拍的，是我在洛杉矶寻找当地餐厅的时候偶然发现的。所以实际情况是，我经常会去那些咖啡店看看，毕竟我本身就很喜欢喝咖啡。有时候它们的内部装饰真的非常漂亮，尤其是现在正值圣诞季节。</p>
        <p>有两点我希望大家注意，那就是直射光源和间接光源。就拿这张照片里的咖啡吧作为例子吧。我得说我们有大量的直射光源，比如天光、咖啡吧台、招牌还有那道巨大的星光。</p>
        <p>此外，照明设备也分为两种类型。针对那些彩色系列产品，我之后会再详细讲解这个话题，当我们进入室内照明部分时。但我只是想让大家先大致了解一下，未来的内容会是什么。</p>
        <p>也就是所有没有罩子的灯具类型，我们把这类灯称为裸光（bare light），原理和太阳、月亮类似，因为它们确实没有罩子，所以在这类情况下，我将其归为裸光。天光照射灯泡属裸光源，同球体、太阳类似。</p>
        <p>而那些光源实际上都属于柔和光线，或者也可以称它们为间接光（indirect light）。因为如果你真的有一盏灯的话，再给它套上一个丝质灯罩或是纸质灯笼。我超喜欢宜家的这类灯笼，它们就是属于间接光源。因为光源会穿过介质，光线会因此发生散射。所以，如果你在没加滤镜的钨丝灯前自拍，再在柔和光源前拍一张不用相机滤镜，你就会发现自己的肤色看起来会好很多很多。</p>
        <p>还有啊，要是站在柔和灯笼前拍照的话，我们女生就超喜欢这么做。不管怎样大家不妨试试看，我希望每个人都能体验一下。</p>
        <p>所以我想稍微谈一下第二张图片，是间接光源。因为在现实生活的日常场景里，我们都更喜欢间接光。原因很简单，因为它的光线很柔和，不会直接刺入眼睛。所以在大多数公共场所比如酒吧里，或是这种鸡尾酒吧、或者像餐厅里那样，尤其是那些高档餐厅，唯一可能使用裸灯的地方就是餐桌上方，因为光线会照在食物上。而餐厅当然希望为顾客提供最优异的体验，所以他们可能会使用聚光灯直接照射餐桌。但这类做法已经出现了很多失败案例。</p>
        <p>我希望大家都能重视这一点，因为这其实是个不错的设计理念。不过这种在餐桌上方照灯的理念，要是场地铺的是大理石，还可能毁了食物的口感，或者是玻璃桌。因为我去过几处这样的地方，实在很不舒适。因为在没有遮盖物的情况下，食物还没端上来时，我基本上是坐在强度极高的裸露聚光灯源与反射光之间。所以有时候我会觉得眼睛仿佛出现了类似光晕的效果。</p>
        <p>大家注意啊，灯光和光线总是相互影响的。根据我那次糟糕的餐厅用餐体验，我希望大家能更加注意所使用的材料，同时在做室内设计时，也要留意光源的亮度。</p>
        <p>那么第一周的练习，各位，我希望你们拍些照片并展示给我看。无论是白天还是夜晚，都可能存在黄金时刻（golden hour），其实没必要非得去什么特别棒的地方。比如在早晨打开窗户时就能拍出不错的照片。把窗户打开，无论晴天还是雨天。但我希望你们注意，首先试着去观察照片，试着在窗户的角落之类的地方拍照，并观察窗框以及墙壁是如何随着一天中不同时间的光线变化而变化的。</p>
        <p>所以如果是室内场景，你们完全可以拍出这样的照片：向大家展示「我觉得这是间接光源，或者这是直接光源」。</p>
        <p>因为在我训练这项技艺之前，在我教授 Unreal 相关知识之前，我想训练所有人的视觉审美能力。</p>
        <p>要在游戏灯光设计取得成绩，需具备敏锐视觉力。其实无论在哪个灯光相关领域都是如此。毕竟现有的渲染方法有成千上万种，还有许多软件知识需要我们不断学习。我个人每个月都会学习新知识，因为游戏行业的进步速度实在快得惊人。但首要的一点是，先训练好你的视觉能力，因为你目前还只知道如何把基础工作做好。只要你的眼力够好，就能具备出色的审美能力。对于我们这些灯光艺术家而言，这一点至关重要。</p>
        <p>另外还要提醒大家，我非常喜爱富有表现力的灯光设计，并且我会一直鼓励大家去尝试。但在开始室外灯光设计之前，稍后你们会和我一起做室内灯光设计，我要对所有人的霓虹灯使用加以严格限制。</p>
        <p>有两部很不错的电影，就霓虹灯的运用而言，我个人觉得它们表现真的很出色。去看吧。《猫》是一部音乐剧，所以如果你不喜欢音乐剧，可以直接跳过这类影片。它的舞台布光效果非常好，氛围浓郁，极具舞台感，所以我非常喜欢这部电影。尤其是《约翰·威克 3》也是如此。对我来说老版的《约翰·威克》在摄影手法上相当出色。这部色彩处理出色，对过饱和色彩掌控很棒。</p>
        <p>所以你或许该问问为什么 Maria 一开始就想阻止大家使用霓虹灯，因为霓虹灯的效果实在太美了，它的色彩极具诱惑力，但我不确定所有人的水平如何。我相信之前我们请过渲染工程师，他们很擅长编程和色彩相关的工作。但问题就在我刚才说的这一点上，我想训练大家的眼光。</p>
        <p>同时我也希望整个训练营都能达到这个目标，大致处于入门级到中等水平的区间。我需要确保每个人都能理解灯光的核心作用，为玩家指引方向，同时还要合理处理空间布局。</p>
        <p>如果您真的对霓虹灯效果感兴趣，那完全可以在最终作品中加入各类相关课程内容。但我不想在之前就让大家产生困惑，或者说我只是不想让各位自行混淆概念。毕竟在 CGI 灯光制作上，尤其是使用 Unreal 引擎时，可发挥的自由度很高。所以请稍安勿躁，让我们一起逐步了解数字以及印刷色彩理论，直到您搞清楚色彩的运作原理。</p>
        <p>我不希望有人只凭直觉就贸然行动，从而混淆概念，然后就说「我想用霓虹灯效果」。其实这并没有什么坏处，但问题在于，在进行灯光设计的同时，你也需要具备相关经验。有了经验我们就能尽情享受灯光设计的乐趣啦。</p>
        <h2>B01 1.0 外景基础（一）· 逐字转写</h2>
        <ul>
        <li>来源：B站 BV17Eeq6sEMY P3（【国语】版；P6 为同内容原声版）</li>
        <li>时长：1094s（18 分 14 秒）</li>
        <li>性质：实操课，软件操作密度高，全课第一个「动手」环节</li>
        <li>转写工具：matrix listen_audio，2026-11-12</li>
        <li>注：ASR 原始结果。「细节追踪 / 全局追踪」= Lumen 的 Detail Tracing / Global Tracing；「天空大气」= Sky Atmosphere；「天光」= Skylight</li>
        </ul>
        <hr />
        <p>大家好，欢迎来到更新后的 Maria 的灯光训练营虚幻引擎 5 版本。</p>
        <p>如果您是我们之前已完成 UE4 课程的学员，首先，非常感谢您依然继续观看这个更新版的课程。正如我在开场介绍视频中所说的课程内容。如果您还没看过那个视频，可以直接回到 Vertex 官网，查看首页的内容。</p>
        <p>在开始实操演示之前，我们先来介绍几个关键的灯光组件。</p>
        <p>因此，虚幻引擎 5 最显著的改动之一就是所有功能都切换为了实时光照。所以如果你原本使用的是混合光照工作流的话，你可能熟悉预烘焙光照贴图的做法，设置二次反射这类方法，至今仍相当常见。这两种不同工作流之间存在不少重叠之处，但在这门针对虚幻引擎 5 升级版本的课程中，我将重点讲解诸多可以利用 Lumen 环境光照功能的技巧与方法。</p>
        <p>内容将会分为三个不同的部分。我们会介绍几种核心的光源组件。就是默认页面上的内容，那就是天空光（Skylight）。如果我进入默认的细节设置页面，你们就能明白我具体在说什么了。接下来我们将讨论定向光（Directional Light）和天空光，这些是 Unreal Engine 5 默认打开的一些旧版资源，那就是反射效果（Reflection Capture）。只是想让各位知道，这种捕捉方法在很大程度上基于之前的屏幕空间反射（SSR）技术，而那也是 Unreal 公司开发的另一项早期实时反射技术。所以我们在这里不再使用它们了。</p>
        <p>我首先要做的就是删除那些元素，因为我们其实并不需要它们。我接下来要讲的还有分叉功能，那也是其中的一部分。不过在这里你们会看到大气雾效（Atmospheric Fog）。在真正开始使用这个默认关卡之前，我会先进行彻底清理，因为目前这里可能并不需要它们。我稍后会解释原因。那就假设你们要为资源编辑创建一个空的空白关卡吧，或者在编辑器中预览你自己的网格模型，那么本课程就将从这里开始。</p>
        <p>好的，我首先要做的就是做一些清理工作。如你们所见，我已经删除了那些反射效果，也就是旧的反射效果。另外我还要在这里替换掉的是默认的 BP 天空球体（BP_Sky_Sphere），它其实就是一个较为简单的默认版本。如果你想使用它，那完全没问题，但我认为这只不过是一个帮助你了解天空高度等相关信息的简易工具而已。对我这个处理光线的人而言，使用更新版本的默认天空球体时，我有更大的操作自由度。我现在就要把它们删除。</p>
        <p>接下来我要做的就是添加即将使用的正确版本，然后向大家展示它的神奇之处。我要添加的版本在「所有效果」（All Effects）类别之下。我们应该能找到天空大气组件（Sky Atmosphere）。这正是我们今天所需要的组件。</p>
        <p>没错，这是另一种版本的天空盒。不过这个组件的优势在于，首先，它的效果是完全动态的，而且你可以利用这里的资源演变（Time of Day）轻松创建不同时段的效果。</p>
        <p>在开始之前，有两件简单的事情需要检查，那就是如果你去查看你的定向光，也就是被称作阳光（Sun）的那个光源，或者直接在光源处输入 atmosphere 这个词。这是 Atmosphere Sun Light 功能的一个非常简化的演示。请确保选中了对应的选项（Atmosphere Sun Light），因为这会告知 Unreal 引擎该执行相应操作。无论是否选中，你的太阳角度都会与天空的散射效果产生关联。</p>
        <p>所以如果现在我取消选中它，你就会发现该效果根本不会显示出来。因此，这是必须做的。否则你就无法看到天空效果。所以，万一你添加了大气天空效果，却什么都不会像这样显示出来，我认为调试时首先需要检查的就是你的定向光，要确保定向光已与大气阳光效果关联（Atmosphere Sun Light = true）。</p>
        <p>因为可以把那三个元素看作是一个整体系统。如果我查看环境光照组合的话，你们会看到这和天空大气有关，也就是这里的蓝色背景，还有天空光本身，以及光源。所以这三者被视为一个整体系统。在虚幻引擎 5 的外部照明系统中，它们会协同工作。</p>
        <p>作为用户我自己注意到的一个区别就是 UE4 和 UE5 之间的差别。因为在 UE4 中，其实不必特意确保天空大气与其它元素联动，你可以自行选择是否要这么做。但关键在于，除非这些组件能正确联动，否则整个系统根本无法运行。</p>
        <p>简单回顾一下：天空大气、天空光以及我们的定向光源。这些就是开启大气光照，也就是大家常说的外部光照时所需的关键要素。</p>
        <p>在开始之前各位，我有几项项目检查事项想快速过一遍。这样就能确保大家使用的是虚幻引擎 5，这样就能让 Lumen 功能正常运行了。这是我们今天的主题，但强调这一项还是非常必要的。</p>
        <p>想必大家都清楚，我们必须启用光线追踪功能。那么有个快速的方法可以判断你是否已启用光线追踪：首先，当然要确保你的硬件配备了支持光线追踪的显卡；第二点则是你可以直接查看项目名称，你会在这里看到我的个人项目名称，因为这是我用来演示的示例项目。在这里你可以快速查看，并确认你的图形驱动是渲染硬件接口（RHI）。这个圆圈中最底下的那一行标注的是 DirectX 12。因为如果版本低于 11，那就无法启用光线追踪功能。</p>
        <p>第二件事就是我们快速进入「窗口」和「项目设置」（Window → Project Settings），也就是文件选项。因为原来的位置已经不在原来的地方了。我们可以快速进入项目设置，只是想确认一下你是否启用了 Lumen。</p>
        <p>其实真的非常简单。你可以快速点击选择 Lumen，确保它默认就能被启用即可。全局光照以及反射处理都是通过 Lumen 来完成的。需要记住的是，如果选择 Lumen，我们之所以放弃屏幕空间捕获功能，也是因为那个捕获功能原本是基于 SSR 的，所以是屏幕空间反射。而且它不再以那种方式处理了。如果我们使用 Lumen 的话，它就相当于其中的一个选项而已。所以如果我们选择搭配 Lumen 的全局光照方案，那么反射方式也必须与 Lumen 保持一致。</p>
        <p>所以这里有两种选择，这其实完全取决于你的项目需求。因为我这里用的示例项目其实是室外照明场景。不过我的场景并没有大到离谱的程度，而且我有大量网格光源彼此紧挨着分布。所以我更倾向于使用光线追踪模式中的细节追踪（Detail Tracing）。</p>
        <p>另一个简单的判断标准是：如果你正在处理一些较小的室内场景，且其中的网格之间存在大量交互，而且这些网格彼此之间的距离还比较近，我觉得选择细节追踪会是不错的选择。但如果是街道标志这类物体，或是景观类场景，那全局追踪（Global Tracing）会更为省力。</p>
        <p>只需稍加注意即可，因为这确实关系到你硬件的性能预算。所以如果你为规模较大的场景选择精细追踪，可能会出现性能问题。比如你有一座巨大的街道，或者一个小城镇，而且其规模非常大，使用 Lumen 的话，你依然能够实现极高的画面质量。而就在这种情况下游戏就可能会崩溃。如果你做出了这样的选择，同时又发现加载场景时十分困难，一个简单的解决办法就是改回使用全局追踪。因为不管怎样，我觉得其实并没有太大区别。这就好比光线追踪的实现方式会有不同的侧重而已。不过也要格外小心谨慎，因为这更多取决于你的硬件性能，而非项目的设置方式。简单来说，差不多就是取决于你所做内容的规模。</p>
        <p>还有另一件事，我肯定会再次谈到曝光问题。没错，曝光可是我最喜欢讨论的主题。不过那要等到几章之后，在我先详细解释外部设置之后才会讲到。所以你们首先需要仔细确认的一点是：在开始学习这门课程之前，只需输入 Exposure 这个词即可。</p>
        <p>在我的讲座中，我会以自动曝光历史（Auto Exposure Histogram）功能作为讲解重点。是否需要在自动曝光设置中扩展默认亮度范围（Extend default luminance range in Auto Exposure settings），这完全由你们自己决定。因为就我的个人习惯而言，我通常会使用这个选项，并将其保持启用状态，因为大部分内容都是我亲自制作的。我是用电影级摄像机（Cine Camera）来渲染它们的，即便是在实时处理时，我依然会使用电影级摄像机。这样我就能拥有更多手动曝光控制选项，比如景深（DoF）或快门速度（shutter speed）这类参数。所以我觉得扩展这个参数范围能让我有更多掌控力。</p>
        <p>但如果你目前还处于入门阶段，如果你认为自己是初学者的话，我建议你可以暂时不调整这些设置。因为默认情况下这样设置会使得曝光范围相对较短，这样会让你的工作更轻松。等你完成了任何类型的灯光项目之后，再尝试开启这个功能即可。但我认为一开始还是把事情简化些为好。</p>
        <p>判断曝光是否合适的最佳方式就是查看曝光表。我们还得靠肉眼来查看，毕竟最终呈现的结果，玩家或观众看到的就是你们的作品。</p>
        <p>另一件或许能帮大家节省些时间的办法是：通常我会在编辑器偏好设置里自定义快捷键。不过我得说自己算不上快捷键专家，所以我一般更倾向于直接按按钮再去寻找对应位置，因为大多数照明功能的操作都是这么进行的。</p>
        <p>不过有一个功能我确实经常使用，那通常就是 Visualize HDR and Adaptation 功能。我从这里就能看出我正在使用 Shift 加上 V 键。如果我向上移动鼠标，系统就会展示出这张神秘又漂亮的图表。它日后会作为我们判断曝光值的参考依据。那些复杂的方法和操作，我稍后会再讲解。我只是想让大家明白这个功能到底是什么。要是想把开发工具里的这个功能调出来，也可以。你可以直接去可视化（Visualize）界面，应该就在这附近。可视化 → 适配（Adaptation）。</p>
        <p>另外还有一个快捷键，也在编辑器设置里。你可能需要进入快捷键设置（Keyboard Shortcuts）页面。你会看到我设置了 Shift 加 C 作为捕捉（Capture）键。不过部分原因也是因为我的手比较小，这样对我来说设置超近距离拍摄会更方便。但这家伙所做的就是：看看如果你切换到天空光模式，就会看到捕捉功能启动。</p>
        <p>没错，我们确实能够启用实时捕捉（Real Time Capture）功能。你可能会看到很多这类功能，都是为来自 ArchViz 的工具或任何实时变化的内容设计的。但说实话，在游戏里这会非常耗费时间。仅仅因为每秒都要用天空光捕捉整个场景，就会造成巨大的成本开销。即便使用最高级的渲染技术，在游戏制作中，这也绝非省钱的做法。所以我们通常仍然需要借助捕捉功能，然后还得重新进行捕捉。如果我在这里进行捕捉的话，你会看到一个小小的按钮用来重新捕捉内容。它就在天空光设置下方用于执行重新捕捉操作（Recapture）。</p>
        <p>我快速向大家演示一下这个功能的具体运作方式。看，我正在操作，这样就能生成非常逼真的效果了。如果切换到纯光照模式（Lighting Only）的话，让我来开启这里的实时功能。</p>
        <p>这还是让我想起灯光需要重新设置，因为默认情况下它是固定不变的（Static），我们不再需要固定状态了，我们要改为动态（Dynamic / Movable）模式。天际线（Sky Light）的处理方式也是一样的。</p>
        <p>现在你可以看出地面实际上已经发生了变化，从之前那段蓝色的时段变成了天空光状态。这是因为天空光会自动为你捕捉这些变化。那如果我选择重新捕捉的话，我们再也看不到那种效果了。不过我们再试一次吧。你们注意看地面，它依然略带黄色和橙色。当我停止它之后，我得回到天空光模式，然后在这里再次进行重拍。</p>
        <p>这样就能看到变化了。接下来我要做一个特写演示。大家可要仔细看哦。我们进入日落场景吧。接着选择天际线。注意看阴影区域的蓝色程度，就像这里一样。我现在要点击天空光并重新捕捉画面。</p>
        <p>你们可以看到场景是如何更新的了。有时候人们会问：「为什么我的场景突然变了？」其实工具本身并没有出问题。</p>
        <p>那就回到我的项目设置里吧。现在你们应该明白为什么我觉得为自己设置快捷键如此重要了。这样就能不断提醒自己：「我需要更新我的天空光，这就是我更新它的方法。」你们可以设置任意喜欢的按键。</p>
        <p>它的功能是：告诉天空光「嘿，一天中不同时间太阳的位置已经变了。接下来我们需要你们重新采集数据，并读取相关信息。这样一整天的光照效果才能正常运作。」</p>
        <p>好了，这也结束了我们这门虚幻引擎 5 升级版光照基础课程的第一部分介绍。下期见。我将为大家讲解如何正确设置，以实现 24 小时不间断的昼夜光照效果。到时候见。</p>
      </>
    ),
  },
];

export function getArchivePost(slug: string | undefined): ArchivePost | undefined {
  return ARCHIVE_POSTS.find((post) => post.slug === slug);
}
