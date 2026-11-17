import type { ReactNode } from "react";

export type ArchivePost = {
  slug: "capsule" | "rainbow" | "ai-tutor" | "scene-3d-pipeline" | "stageshow-teardown";
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
];

export function getArchivePost(slug: string | undefined): ArchivePost | undefined {
  return ARCHIVE_POSTS.find((post) => post.slug === slug);
}
